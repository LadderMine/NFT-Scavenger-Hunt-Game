import { Answers } from "src/answers/answers.entity";
import { Hints } from "src/hints/hints.entity";
import { Level } from "src/level/entities/level.entity";
import { NFTs } from "src/nfts/nfts.entity";
import { Scores } from "src/scores/scores.entity";
import { UserProgress } from "src/user-progress/UserProgress.entity";
import { User } from "src/users/users.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm"

@Entity()
export class Puzzles {
  @PrimaryGeneratedColumn()
  id: number


  @ManyToOne(() => User, (user) => user.puzzles, { onDelete: "CASCADE" })
  user: User;
  @OneToMany(() => UserProgress, (userProgress) => userProgress.puzzle)
  userProgress: UserProgress[];

  @OneToMany(() => Scores, (scores) => scores.puzzles, { cascade: true })
  scores: Scores[];

  @OneToMany(() => Hints, (hints) => hints.puzzles, { eager: true })
  hints: Hints[];

  @ManyToMany(() => NFTs, (nfts) => nfts.puzzles, { cascade: true })
  @JoinTable()
  nfts: NFTs[];

  @ManyToOne(() => Answers, (answer) => answer.puzzles, { cascade: true })
  answer: Answers;

  // @ManyToMany(() => NFTs, (nft) => nft.puzzles, { cascade: true })
  // @JoinTable()
  // nfts: NFTs[];


  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date


  @Column({ type: "int" })
  pointValue: number;


  @ManyToOne(() => Level, (level) => level.puzzles)
  level: Level;
}

