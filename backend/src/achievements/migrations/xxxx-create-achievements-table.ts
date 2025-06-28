// src/achievements/migrations/xxxx-create-achievements-table.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAchievementsTable1234567890123
  implements MigrationInterface
{
  name = 'CreateAchievementsTable1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create achievements table
    await queryRunner.createTable(
      new Table({
        name: 'achievements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'icon_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'rule_type',
            type: 'enum',
            enum: [
              'puzzle_completion_time',
              'login_streak',
              'total_puzzles_completed',
              'first_puzzle',
              'daily_login',
            ],
            isNullable: false,
          },
          {
            name: 'rule_value',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create player_achievements table
    await queryRunner.createTable(
      new Table({
        name: 'player_achievements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'player_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'achievement_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'earned_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['achievement_id'],
            referencedTableName: 'achievements',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_PLAYER_ACHIEVEMENT_UNIQUE',
            columnNames: ['player_id', 'achievement_id'],
            isUnique: true,
          },
          {
            name: 'IDX_PLAYER_ACHIEVEMENTS_PLAYER_ID',
            columnNames: ['player_id'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('player_achievements');
    await queryRunner.dropTable('achievements');
  }
}
