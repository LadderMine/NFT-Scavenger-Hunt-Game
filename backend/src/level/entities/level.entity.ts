import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { LevelEnum } from 'src/enums/LevelEnum';

@Entity()
export class Level {
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
}
