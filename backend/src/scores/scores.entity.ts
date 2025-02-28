import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn 
  } from 'typeorm';
  import { User } from 'src/users/users.entity';
  import { Puzzles } from 'src/puzzles/puzzles.entity';
  
  @Entity()
  export class Scores {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
    user: User;
  
    @ManyToOne(() => Puzzles, (puzzle) => puzzle.scores, { onDelete: 'SET NULL' })
    puzzle: Puzzles;
  
    @Column({ type: 'int', default: 0 })
    score: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  