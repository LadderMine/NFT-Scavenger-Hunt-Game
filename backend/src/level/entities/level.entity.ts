import { InjectRepository } from '@nestjs/typeorm';
import { LevelEnum } from 'src/enums/LevelEnum';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Repository } from 'typeorm';

@Entity()
export class Level {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>
  ) {}
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  easy: number;

  @Column({ default: 0 })
  medium: number;

  @Column({ default: 0 })
  difficult: number;

  @Column({ default: 0 })
  advanced: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Puzzles, (puzzle) => puzzle.level)
  puzzles: Puzzles[];

  @Column({ type: 'int', default: 0 })
  count: number;

  @Column({
    type: 'enum',
    enum: LevelEnum,
    unique: true,
  })
  level: LevelEnum;

  public  async incrementCount(level: LevelEnum) {
    let levelRecord = await this.levelRepository.findOne({ where: { level } });
this.levelRepository
    if (!levelRecord) {
      levelRecord = this.levelRepository.create({ level, count: 1 });
    } else {
      levelRecord.count += 1;
    }

    await this.levelRepository.save(levelRecord);
  }

  public async decrementCount(level: LevelEnum) {
    const levelRecord = await this.levelRepository.findOne({ where: { level } });

    if (levelRecord) {
      levelRecord.count = Math.max(0, levelRecord.count - 1);
      await this.levelRepository.save(levelRecord);
    }
  }
}
