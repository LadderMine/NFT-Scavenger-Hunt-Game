import { Hints } from "src/hints/hints.entity";
import { Puzzles } from "src/puzzles/puzzles.entity";
import { User } from "src/users/users.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity()
export class NFTs {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.nfts, { onDelete: "CASCADE" })
  user: User;

  @ManyToMany(() => Puzzles, (puzzles) => puzzles.nfts, { cascade: true })
  @JoinTable()
  puzzles: Puzzles[];
  @OneToMany(() => Hints, (hint) => hint.userProgress, { cascade: true })
    hints: Hints[];
}
