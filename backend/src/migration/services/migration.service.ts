import { Injectable, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Puzzle } from "../entities/puzzle.entity"
import type { PuzzleData, MigrationResult, MigrationError } from "../interfaces/puzzle.interface"

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name)

  constructor(private readonly puzzleRepository: Repository<Puzzle>) {}

  /**
   * Migrate puzzle data to database
   */
  async migratePuzzles(
    puzzleData: PuzzleData[],
    uploadInfo: { filename: string; fileSize: number; uploadedBy: string },
  ): Promise<MigrationResult> {
    this.logger.log(`Starting migration of ${puzzleData.length} puzzles`)

    const errors: MigrationError[] = []
    let successfulInserts = 0
    let duplicatesSkipped = 0

    for (let i = 0; i < puzzleData.length; i++) {
      const puzzle = puzzleData[i]

      try {
        // Check for duplicates
        const existingPuzzle = await this.puzzleRepository.findOne({
          where: {
            title: puzzle.title,
            category: puzzle.category,
          },
        })

        if (existingPuzzle) {
          this.logger.warn(`Duplicate puzzle found: ${puzzle.title} in category ${puzzle.category}`)
          duplicatesSkipped++
          continue
        }

        // Create new puzzle entity
        const newPuzzle = this.puzzleRepository.create({
          title: puzzle.title,
          description: puzzle.description,
          difficulty: puzzle.difficulty,
          category: puzzle.category,
          content: puzzle.content,
          metadata: puzzle.metadata,
          tags: puzzle.tags,
          isActive: puzzle.isActive,
        })

        await this.puzzleRepository.save(newPuzzle)
        successfulInserts++

        this.logger.debug(`Successfully inserted puzzle: ${puzzle.title}`)
      } catch (error) {
        this.logger.error(`Failed to insert puzzle at index ${i}: ${error.message}`)
        errors.push({
          index: i,
          puzzle,
          error: error.message,
        })
      }
    }

    const result: MigrationResult = {
      success: errors.length === 0,
      summary: {
        totalProcessed: puzzleData.length,
        successfulInserts,
        failedInserts: errors.length,
        duplicatesSkipped,
      },
      errors,
      uploadInfo: {
        ...uploadInfo,
        uploadedAt: new Date(),
      },
    }

    this.logger.log(
      `Migration completed: ${successfulInserts} inserted, ${duplicatesSkipped} duplicates skipped, ${errors.length} failed`,
    )

    return result
  }

  /**
   * Get migration statistics
   */
  async getMigrationStats(): Promise<{
    totalPuzzles: number
    puzzlesByDifficulty: Record<string, number>
    puzzlesByCategory: Record<string, number>
    recentUploads: number
  }> {
    const totalPuzzles = await this.puzzleRepository.count()

    const difficultyStats = await this.puzzleRepository
      .createQueryBuilder("puzzle")
      .select("puzzle.difficulty", "difficulty")
      .addSelect("COUNT(*)", "count")
      .groupBy("puzzle.difficulty")
      .getRawMany()

    const categoryStats = await this.puzzleRepository
      .createQueryBuilder("puzzle")
      .select("puzzle.category", "category")
      .addSelect("COUNT(*)", "count")
      .groupBy("puzzle.category")
      .getRawMany()

    const recentUploads = await this.puzzleRepository.count({
      where: {
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    })

    return {
      totalPuzzles,
      puzzlesByDifficulty: difficultyStats.reduce((acc, item) => {
        acc[item.difficulty] = Number.parseInt(item.count)
        return acc
      }, {}),
      puzzlesByCategory: categoryStats.reduce((acc, item) => {
        acc[item.category] = Number.parseInt(item.count)
        return acc
      }, {}),
      recentUploads,
    }
  }

  /**
   * Cleanup old puzzle data (if needed)
   */
  async cleanupOldPuzzles(daysOld = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

    const result = await this.puzzleRepository
      .createQueryBuilder()
      .delete()
      .where("createdAt < :cutoffDate", { cutoffDate })
      .andWhere("isActive = :isActive", { isActive: false })
      .execute()

    this.logger.log(`Cleaned up ${result.affected} old inactive puzzles`)
    return result.affected || 0
  }
}
