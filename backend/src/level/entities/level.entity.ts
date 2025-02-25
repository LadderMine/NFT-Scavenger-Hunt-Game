import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Puzzles } from "src/puzzles/puzzles.entity";

@Entity()
export class Level {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  difficulty: string;

  @Column({ type: "int", default: 0 })
  requiredScore: number;

  @Column({ default: false })
  isLocked: boolean;

  @OneToMany(() => Puzzles, (puzzle) => puzzle.level)
  puzzles: Puzzles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}