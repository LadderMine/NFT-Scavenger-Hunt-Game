import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Repository, type DataSource, LessThan, MoreThanOrEqual } from "typeorm"
import { Booster, BoosterType } from "./entities/booster.entity"
import { PlayerBooster } from "./entities/player-booster.entity"
import { BoosterUsage } from "./entities/booster-usage.entity"
import { BoosterBundle } from "./entities/booster-bundle.entity"
import { BoosterGift } from "./entities/booster-gift.entity"
import { BoosterAchievement } from "./entities/booster-achievement.entity"
import { PlayerAchievement } from "./entities/player-achievement.entity"
import type { CreateBoosterDto } from "./dto/create-booster.dto"
import type { UpdateBoosterDto } from "./dto/update-booster.dto"
import type { UseBoosterDto } from "./dto/use-booster.dto"
import type { PurchaseBoosterDto } from "./dto/purchase-booster.dto"
import type { CreateBoosterBundleDto } from "./dto/create-booster-bundle.dto"
import type { PurchaseBundleDto } from "./dto/purchase-bundle.dto"
import type { GiftBoosterDto } from "./dto/gift-booster.dto"
import type { RespondToGiftDto } from "./dto/respond-to-gift.dto"
import type { CreateAchievementDto } from "./dto/create-achievement.dto"
import type { ClaimAchievementDto } from "./dto/claim-achievement.dto"
import type { UsersService } from "../users/users.service"
import type { NotificationsService } from "../notifications/notifications.service"
import type { SchedulerRegistry } from "@nestjs/schedule"
import { CronJob } from "cron"

@Injectable()
export class BoostersService {
  constructor(
    @InjectRepository(Booster)
    private boostersRepository: Repository<Booster>,
    @InjectRepository(PlayerBooster)
    private playerBoostersRepository: Repository<PlayerBooster>,
    @InjectRepository(BoosterUsage)
    private boosterUsagesRepository: Repository<BoosterUsage>,
    @InjectRepository(BoosterBundle)
    private boosterBundlesRepository: Repository<BoosterBundle>,
    @InjectRepository(BoosterGift)
    private boosterGiftsRepository: Repository<BoosterGift>,
    @InjectRepository(BoosterAchievement)
    private boosterAchievementsRepository: Repository<BoosterAchievement>,
    @InjectRepository(PlayerAchievement)
    private playerAchievementsRepository: Repository<PlayerAchievement>,
    private dataSource: DataSource,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    // Set up daily and weekly reset jobs
    this.setupResetJobs();
  }

  private setupResetJobs() {
    // Daily reset job at midnight
    const dailyJob = new CronJob("0 0 * * *", () => {
      this.resetDailyUsageCounts()
    })

    // Weekly reset job at midnight on Sunday
    const weeklyJob = new CronJob("0 0 * * 0", () => {
      this.resetWeeklyUsageCounts()
    })

    this.schedulerRegistry.addCronJob("resetDailyBoosterUsage", dailyJob)
    this.schedulerRegistry.addCronJob("resetWeeklyBoosterUsage", weeklyJob)

    dailyJob.start()
    weeklyJob.start()
  }

  private async resetDailyUsageCounts() {
    await this.playerBoostersRepository.update(
      {},
      {
        dailyUsed: 0,
        lastDailyReset: new Date(),
      },
    )
  }

  private async resetWeeklyUsageCounts() {
    await this.playerBoostersRepository.update(
      {},
      {
        weeklyUsed: 0,
        lastWeeklyReset: new Date(),
      },
    )
  }

  // Booster CRUD operations
  async create(createBoosterDto: CreateBoosterDto): Promise<Booster> {
    const booster = this.boostersRepository.create(createBoosterDto)
    return this.boostersRepository.save(booster)
  }

  async findAll(includeInactive = false): Promise<Booster[]> {
    if (includeInactive) {
      return this.boostersRepository.find()
    }
    return this.boostersRepository.find({ where: { isActive: true } })
  }

  async findOne(id: string): Promise<Booster> {
    const booster = await this.boostersRepository.findOne({ where: { id } })
    if (!booster) {
      throw new NotFoundException(`Booster with ID ${id} not found`)
    }
    return booster
  }

  async update(id: string, updateBoosterDto: UpdateBoosterDto): Promise<Booster> {
    const booster = await this.findOne(id)
    this.boostersRepository.merge(booster, updateBoosterDto)
    return this.boostersRepository.save(booster)
  }

  async remove(id: string): Promise<void> {
    const result = await this.boostersRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Booster with ID ${id} not found`)
    }
  }

  // Player booster inventory management
  async getUserBoosters(userId: string): Promise<PlayerBooster[]> {
    // Clean up expired boosters first
    await this.cleanupExpiredBoosters(userId)

    return this.playerBoostersRepository.find({
      where: { userId, quantity: MoreThanOrEqual(1) },
      relations: ["booster"],
    })
  }

  private async cleanupExpiredBoosters(userId: string): Promise<void> {
    const now = new Date()
    await this.playerBoostersRepository.delete({
      userId,
      expiresAt: LessThan(now),
    })
  }

  async purchaseBooster(userId: string, purchaseDto: PurchaseBoosterDto): Promise<PlayerBooster> {
    const { boosterId, quantity } = purchaseDto

    // Check if booster exists and is active
    const booster = await this.boostersRepository.findOne({
      where: { id: boosterId, isActive: true },
    })

    if (!booster) {
      throw new NotFoundException(`Booster with ID ${boosterId} not found or is inactive`)
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Check if user has enough currency (implement your own logic)
      const user = await this.usersService.findOne(userId)
      const totalCost = booster.price * quantity

      if (user.balance < totalCost) {
        throw new BadRequestException("Insufficient balance to purchase boosters")
      }

      // Update user balance
      await this.usersService.updateBalance(userId, -totalCost)

      // Check if user already has this booster
      let playerBooster = await this.playerBoostersRepository.findOne({
        where: { userId, boosterId },
      })

      // Calculate expiration date if needed (30 days from now as default)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      if (playerBooster) {
        // Update existing booster quantity
        playerBooster.quantity += quantity
        // Update expiration only if it would extend the current expiration
        if (!playerBooster.expiresAt || playerBooster.expiresAt < expiresAt) {
          playerBooster.expiresAt = expiresAt
        }
      } else {
        // Create new player booster entry
        playerBooster = this.playerBoostersRepository.create({
          userId,
          boosterId,
          quantity,
          expiresAt,
        })
      }

      // Save changes
      await this.playerBoostersRepository.save(playerBooster)

      // Record the purchase in analytics (implement your own logic)
      // this.analyticsService.recordBoosterPurchase(userId, boosterId, quantity, totalCost);

      // Send notification to user
      await this.notificationsService.sendBoosterPurchaseNotification(userId, booster.name, quantity)

      // Check for achievements related to booster purchases
      await this.checkPurchaseAchievements(userId, boosterId, quantity)

      // Commit transaction
      await queryRunner.commitTransaction()

      return playerBooster
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  async useBooster(userId: string, useBoosterDto: UseBoosterDto): Promise<any> {
    const { boosterId, puzzleId, metadata } = useBoosterDto

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Check if user has the booster
      const playerBooster = await this.playerBoostersRepository.findOne({
        where: { userId, boosterId },
        relations: ["booster"],
      })

      if (!playerBooster || playerBooster.quantity <= 0) {
        throw new BadRequestException("You do not have this booster available")
      }

      const booster = playerBooster.booster

      // Check if booster is active
      if (!booster.isActive) {
        throw new BadRequestException("This booster is no longer active")
      }

      // Check for expiration
      if (playerBooster.expiresAt && playerBooster.expiresAt < new Date()) {
        throw new BadRequestException("This booster has expired")
      }

      // Check cooldown period
      if (booster.cooldownSeconds > 0 && playerBooster.lastUsedAt) {
        const cooldownEnds = new Date(playerBooster.lastUsedAt)
        cooldownEnds.setSeconds(cooldownEnds.getSeconds() + booster.cooldownSeconds)

        if (cooldownEnds > new Date()) {
          const remainingSeconds = Math.ceil((cooldownEnds.getTime() - new Date().getTime()) / 1000)
          throw new BadRequestException(`This booster is on cooldown. Available in ${remainingSeconds} seconds`)
        }
      }

      // Check daily usage limit
      if (booster.dailyUsageLimit && playerBooster.dailyUsed >= booster.dailyUsageLimit) {
        throw new BadRequestException(`You've reached the daily usage limit for this booster`)
      }

      // Check weekly usage limit
      if (booster.weeklyUsageLimit && playerBooster.weeklyUsed >= booster.weeklyUsageLimit) {
        throw new BadRequestException(`You've reached the weekly usage limit for this booster`)
      }

      // Calculate effective until date based on booster duration
      const effectiveUntil = new Date()
      effectiveUntil.setSeconds(effectiveUntil.getSeconds() + booster.duration * 60)

      // Decrement booster quantity
      playerBooster.quantity -= 1
      playerBooster.totalUsed += 1
      playerBooster.dailyUsed += 1
      playerBooster.weeklyUsed += 1
      playerBooster.lastUsedAt = new Date()

      // Update player booster
      await this.playerBoostersRepository.save(playerBooster)

      // Record booster usage
      const boosterUsage = this.boosterUsagesRepository.create({
        userId,
        boosterId,
        puzzleId,
        metadata,
        effectiveUntil,
        wasSuccessful: true,
      })

      await this.boosterUsagesRepository.save(boosterUsage)

      // Prepare response based on booster type
      const response: any = {
        success: true,
        message: "Booster used successfully",
        effectiveUntil,
      }

      switch (booster.type) {
        case BoosterType.HINT:
          response.hint = `Hint for puzzle ${puzzleId}`
          response.value = booster.value
          break
        case BoosterType.SKIP:
          response.skipped = true
          break
        case BoosterType.TIME_EXTENSION:
          response.timeExtended = true
          response.additionalTime = booster.value
          break
        case BoosterType.DOUBLE_POINTS:
          response.pointsMultiplier = 2
          response.duration = booster.duration
          break
        case BoosterType.REVEAL_ANSWER:
          response.answerRevealed = true
          break
        case BoosterType.RETRY:
          response.retryEnabled = true
          break
      }

      // Update booster usage with result
      boosterUsage.result = JSON.stringify(response)
      await this.boosterUsagesRepository.save(boosterUsage)

      // Check for achievements related to booster usage
      await this.checkUsageAchievements(userId, boosterId)

      // Commit transaction
      await queryRunner.commitTransaction()

      return response
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  async getBoosterUsageHistory(userId: string, limit = 20, offset = 0): Promise<BoosterUsage[]> {
    return this.boosterUsagesRepository.find({
      where: { userId },
      relations: ["booster"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    })
  }

  // Booster bundles
  async createBoosterBundle(createBundleDto: CreateBoosterBundleDto): Promise<BoosterBundle> {
    // Verify booster exists
    await this.findOne(createBundleDto.boosterId)

    const bundle = this.boosterBundlesRepository.create(createBundleDto)
    return this.boosterBundlesRepository.save(bundle)
  }

  async getActiveBundles(): Promise<BoosterBundle[]> {
    const now = new Date()
    return this.boosterBundlesRepository.find({
      where: [
        { isActive: true, startsAt: null, endsAt: null },
        { isActive: true, startsAt: LessThan(now), endsAt: MoreThanOrEqual(now) },
        { isActive: true, startsAt: null, endsAt: MoreThanOrEqual(now) },
        { isActive: true, startsAt: LessThan(now), endsAt: null },
      ],
      relations: ["booster"],
    })
  }

  async purchaseBundle(userId: string, purchaseDto: PurchaseBundleDto): Promise<PlayerBooster> {
    const { bundleId } = purchaseDto

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Get the bundle
      const bundle = await this.boosterBundlesRepository.findOne({
        where: { id: bundleId, isActive: true },
        relations: ["booster"],
      })

      if (!bundle) {
        throw new NotFoundException("Bundle not found or is inactive")
      }

      // Check if bundle is within valid date range
      const now = new Date()
      if ((bundle.startsAt && bundle.startsAt > now) || (bundle.endsAt && bundle.endsAt < now)) {
        throw new BadRequestException("This bundle is not currently available")
      }

      // Check purchase limit if applicable
      if (bundle.purchaseLimit > 0) {
        const purchaseCount = await this.boosterUsagesRepository.count({
          where: {
            userId,
            metadata: { bundleId },
          },
        })

        if (purchaseCount >= bundle.purchaseLimit) {
          throw new BadRequestException("You have reached the purchase limit for this bundle")
        }
      }

      // Check if user has enough currency
      const user = await this.usersService.findOne(userId)
      const price = bundle.discountedPrice || bundle.price

      if (user.balance < price) {
        throw new BadRequestException("Insufficient balance to purchase this bundle")
      }

      // Update user balance
      await this.usersService.updateBalance(userId, -price)

      // Add boosters to user inventory
      let playerBooster = await this.playerBoostersRepository.findOne({
        where: { userId, boosterId: bundle.boosterId },
      })

      // Calculate expiration date (30 days from now as default)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      if (playerBooster) {
        // Update existing booster quantity
        playerBooster.quantity += bundle.quantity
        // Update expiration only if it would extend the current expiration
        if (!playerBooster.expiresAt || playerBooster.expiresAt < expiresAt) {
          playerBooster.expiresAt = expiresAt
        }
      } else {
        // Create new player booster entry
        playerBooster = this.playerBoostersRepository.create({
          userId,
          boosterId: bundle.boosterId,
          quantity: bundle.quantity,
          expiresAt,
        })
      }

      // Save changes
      await this.playerBoostersRepository.save(playerBooster)

      // Record the bundle purchase
      const boosterUsage = this.boosterUsagesRepository.create({
        userId,
        boosterId: bundle.boosterId,
        metadata: {
          bundleId: bundle.id,
          bundleName: bundle.name,
          price,
          quantity: bundle.quantity,
          isPurchase: true,
        },
        wasSuccessful: true,
      })

      await this.boosterUsagesRepository.save(boosterUsage)

      // Send notification to user
      await this.notificationsService.sendBundlePurchaseNotification(userId, bundle.name, bundle.quantity)

      // Commit transaction
      await queryRunner.commitTransaction()

      return playerBooster
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  // Booster gifting system
  async giftBooster(userId: string, giftDto: GiftBoosterDto): Promise<BoosterGift> {
    const { recipientId, boosterId, quantity, message } = giftDto

    // Check if booster exists and is giftable
    const booster = await this.boostersRepository.findOne({
      where: { id: boosterId, isActive: true, isGiftable: true },
    })

    if (!booster) {
      throw new BadRequestException("Booster not found, inactive, or not giftable")
    }

    // Check if recipient exists
    await this.usersService.findOne(recipientId)

    // Check if sender has enough boosters
    const senderBooster = await this.playerBoostersRepository.findOne({
      where: { userId, boosterId },
    })

    if (!senderBooster || senderBooster.quantity < quantity) {
      throw new BadRequestException("You do not have enough boosters to gift")
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Deduct boosters from sender
      senderBooster.quantity -= quantity
      await this.playerBoostersRepository.save(senderBooster)

      // Create gift record
      const gift = this.boosterGiftsRepository.create({
        senderId: userId,
        recipientId,
        boosterId,
        quantity,
        message,
      })

      await this.boosterGiftsRepository.save(gift)

      // Notify recipient
      await this.notificationsService.sendBoosterGiftNotification(recipientId, userId, booster.name, quantity)

      // Commit transaction
      await queryRunner.commitTransaction()

      return gift
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  async getPendingGifts(userId: string): Promise<BoosterGift[]> {
    return this.boosterGiftsRepository.find({
      where: { recipientId: userId, isAccepted: false },
      relations: ["sender", "booster"],
    })
  }

  async respondToGift(userId: string, responseDto: RespondToGiftDto): Promise<void> {
    const { giftId, accept } = responseDto

    // Find the gift
    const gift = await this.boosterGiftsRepository.findOne({
      where: { id: giftId, recipientId: userId, isAccepted: false },
      relations: ["booster"],
    })

    if (!gift) {
      throw new NotFoundException("Gift not found or already processed")
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (accept) {
        // Add boosters to recipient's inventory
        let recipientBooster = await this.playerBoostersRepository.findOne({
          where: { userId, boosterId: gift.boosterId },
        })

        // Calculate expiration date (30 days from now as default)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30)

        if (recipientBooster) {
          // Update existing booster quantity
          recipientBooster.quantity += gift.quantity
          // Update expiration only if it would extend the current expiration
          if (!recipientBooster.expiresAt || recipientBooster.expiresAt < expiresAt) {
            recipientBooster.expiresAt = expiresAt
          }
        } else {
          // Create new player booster entry
          recipientBooster = this.playerBoostersRepository.create({
            userId,
            boosterId: gift.boosterId,
            quantity: gift.quantity,
            expiresAt,
          })
        }

        await this.playerBoostersRepository.save(recipientBooster)
      } else {
        // If rejected, return boosters to sender
        let senderBooster = await this.playerBoostersRepository.findOne({
          where: { userId: gift.senderId, boosterId: gift.boosterId },
        })

        if (senderBooster) {
          senderBooster.quantity += gift.quantity
        } else {
          // Create new player booster entry for sender
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 30)

          senderBooster = this.playerBoostersRepository.create({
            userId: gift.senderId,
            boosterId: gift.boosterId,
            quantity: gift.quantity,
            expiresAt,
          })
        }

        await this.playerBoostersRepository.save(senderBooster)
      }

      // Update gift status
      gift.isAccepted = accept
      gift.acceptedAt = new Date()
      await this.boosterGiftsRepository.save(gift)

      // Notify sender of response
      await this.notificationsService.sendGiftResponseNotification(
        gift.senderId,
        userId,
        gift.booster.name,
        gift.quantity,
        accept,
      )

      // Commit transaction
      await queryRunner.commitTransaction()
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  // Achievement system
  async createAchievement(createAchievementDto: CreateAchievementDto): Promise<BoosterAchievement> {
    // Verify reward booster exists
    await this.findOne(createAchievementDto.rewardBoosterId)

    const achievement = this.boosterAchievementsRepository.create(createAchievementDto)
    return this.boosterAchievementsRepository.save(achievement)
  }

  async getAchievements(): Promise<BoosterAchievement[]> {
    return this.boosterAchievementsRepository.find({
      where: { isActive: true },
      relations: ["rewardBooster"],
    })
  }

  async getUserAchievements(userId: string): Promise<PlayerAchievement[]> {
    return this.playerAchievementsRepository.find({
      where: { userId },
      relations: ["achievement", "achievement.rewardBooster"],
    })
  }

  async updateAchievementProgress(userId: string, achievementId: string, progress: number): Promise<PlayerAchievement> {
    // Get the achievement
    const achievement = await this.boosterAchievementsRepository.findOne({
      where: { id: achievementId, isActive: true },
    })

    if (!achievement) {
      throw new NotFoundException("Achievement not found or inactive")
    }

    // Get or create player achievement
    let playerAchievement = await this.playerAchievementsRepository.findOne({
      where: { userId, achievementId },
    })

    if (!playerAchievement) {
      playerAchievement = this.playerAchievementsRepository.create({
        userId,
        achievementId,
        progress: 0,
      })
    }

    // Update progress
    playerAchievement.progress += progress

    // Check if achievement is completed
    if (!playerAchievement.isCompleted && playerAchievement.progress >= achievement.threshold) {
      playerAchievement.isCompleted = true
      playerAchievement.completedAt = new Date()

      // Notify user of achievement completion
      await this.notificationsService.sendAchievementCompletedNotification(userId, achievement.name)
    }

    return this.playerAchievementsRepository.save(playerAchievement)
  }

  async claimAchievementReward(userId: string, claimDto: ClaimAchievementDto): Promise<PlayerBooster> {
    const { achievementId } = claimDto

    // Get player achievement
    const playerAchievement = await this.playerAchievementsRepository.findOne({
      where: { userId, achievementId, isCompleted: true, isRewardClaimed: false },
      relations: ["achievement"],
    })

    if (!playerAchievement) {
      throw new BadRequestException("Achievement not completed or reward already claimed")
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Mark reward as claimed
      playerAchievement.isRewardClaimed = true
      playerAchievement.rewardClaimedAt = new Date()
      await this.playerAchievementsRepository.save(playerAchievement)

      // Get achievement details
      const achievement = await this.boosterAchievementsRepository.findOne({
        where: { id: achievementId },
      })

      // Add reward boosters to user inventory
      let playerBooster = await this.playerBoostersRepository.findOne({
        where: { userId, boosterId: achievement.rewardBoosterId },
      })

      // Calculate expiration date (30 days from now as default)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      if (playerBooster) {
        // Update existing booster quantity
        playerBooster.quantity += achievement.rewardQuantity
        // Update expiration only if it would extend the current expiration
        if (!playerBooster.expiresAt || playerBooster.expiresAt < expiresAt) {
          playerBooster.expiresAt = expiresAt
        }
      } else {
        // Create new player booster entry
        playerBooster = this.playerBoostersRepository.create({
          userId,
          boosterId: achievement.rewardBoosterId,
          quantity: achievement.rewardQuantity,
          expiresAt,
        })
      }

      await this.playerBoostersRepository.save(playerBooster)

      // Commit transaction
      await queryRunner.commitTransaction()

      return playerBooster
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      // Release query runner
      await queryRunner.release()
    }
  }

  // Achievement tracking helpers
  private async checkPurchaseAchievements(userId: string, boosterId: string, quantity: number): Promise<void> {
    // Get all active achievements
    const achievements = await this.boosterAchievementsRepository.find({
      where: { isActive: true, requirement: "purchase_boosters" },
    })

    for (const achievement of achievements) {
      await this.updateAchievementProgress(userId, achievement.id, quantity)
    }
  }

  private async checkUsageAchievements(userId: string, boosterId: string): Promise<void> {
    // Get all active achievements
    const achievements = await this.boosterAchievementsRepository.find({
      where: [
        { isActive: true, requirement: "use_boosters" },
        { isActive: true, requirement: `use_booster_${boosterId}` },
      ],
    })

    for (const achievement of achievements) {
      await this.updateAchievementProgress(userId, achievement.id, 1)
    }
  }

  // Analytics
  async getBoosterUsageStats(startDate?: Date, endDate?: Date): Promise<any> {
    const query = this.boosterUsagesRepository
      .createQueryBuilder("usage")
      .select("booster.type", "boosterType")
      .addSelect("COUNT(*)", "usageCount")
      .innerJoin("usage.booster", "booster")
      .groupBy("booster.type")
      .orderBy("usageCount", "DESC")

    if (startDate && endDate) {
      query.where("usage.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return query.getRawMany()
  }

  async getTopBoosterUsers(limit = 10): Promise<any> {
    return this.boosterUsagesRepository
      .createQueryBuilder("usage")
      .select("usage.userId", "userId")
      .addSelect("COUNT(*)", "usageCount")
      .groupBy("usage.userId")
      .orderBy("usageCount", "DESC")
      .limit(limit)
      .getRawMany()
  }

  async getBoosterRevenue(startDate?: Date, endDate?: Date): Promise<any> {
    const query = this.boosterUsagesRepository
      .createQueryBuilder("usage")
      .select("booster.type", "boosterType")
      .addSelect("SUM(usage.metadata->'price')", "totalRevenue")
      .innerJoin("usage.booster", "booster")
      .where("usage.metadata->'isPurchase' = :isPurchase", { isPurchase: true })
      .groupBy("booster.type")
      .orderBy("totalRevenue", "DESC")

    if (startDate && endDate) {
      query.andWhere("usage.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    return query.getRawMany()
  }

  // Leaderboards
  async getBoosterUsageLeaderboard(boosterId?: string, limit = 10): Promise<any> {
    const query = this.boosterUsagesRepository
      .createQueryBuilder("usage")
      .select("usage.userId", "userId")
      .addSelect("COUNT(*)", "usageCount")
      .groupBy("usage.userId")
      .orderBy("usageCount", "DESC")
      .limit(limit)

    if (boosterId) {
      query.where("usage.boosterId = :boosterId", { boosterId })
    }

    return query.getRawMany()
  }
}

