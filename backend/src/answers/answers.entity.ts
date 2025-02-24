import { Hints } from 'src/hints/hints.entity';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Answers {
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => Hints, (hint) => hint.answer)
    @JoinColumn()
    hint: Hints;
    
  @OneToMany(() => Puzzles, (puzzles) => puzzles.answer)
  puzzles: Puzzles[];

  @OneToOne(() => Hints, (hint) => hint.answer, { cascade: true })
  hints: Hints;

//   @OneToMany(() => Hints, (hints) => hints.answer)
//   hints: Hints[];
  }

