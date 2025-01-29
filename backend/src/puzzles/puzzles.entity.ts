import { Hints } from "src/hints/hints.entity";
import { NFTs } from "src/nfts/nfts.entity";
import { UserProgress } from "src/user-progress/userprogress.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm"

@Entity()
export class Puzzles {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Hints, (hints) => hints.puzzles) 
  hints: Hints[];


  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt: Date


  @Column({ type: "int" })
  pointValue: number;

  @OneToMany(
    () => UserProgress,
    (userProgress) => userProgress.puzzles,
  )
  userProgress: UserProgress[]

  @OneToOne(() => NFTs, (nfts) => nfts.puzzles) 
  nfts: NFTs;
}

