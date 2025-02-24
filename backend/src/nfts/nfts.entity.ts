import { Puzzles } from "src/puzzles/puzzles.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

@Entity()
export class NFTs {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(
    () => Puzzles,
    (puzzles) => puzzles.nfts,
  )
  @JoinColumn()
  puzzles: Puzzles
}

