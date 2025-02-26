import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn, 
    ManyToOne 
} from 'typeorm';
import { User } from '../users/users.entity';
import { Puzzles } from '../puzzles/puzzles.entity';

@Entity()
export class Scores {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' }) // Relationship with User
    user: User;
    
    @Column({ type: 'int', default: 0 })
    score: number;

    @ManyToOne(() => Puzzles, (puzzle) => puzzle.scores, { onDelete: 'CASCADE' }) // Relationship with Puzzle
    puzzleId: Puzzles;
    
    @ManyToOne(() => User, (user) => user.scores, { onDelete: "CASCADE" })
    user: User;
  
    @ManyToOne(() => Puzzles, (puzzles) => puzzles.scores, { onDelete: "CASCADE" })
    puzzles: Puzzles;
  
    @ManyToOne(() => UserProgress, (userProgress) => userProgress.scores, { cascade: true })
    userProgress: UserProgress;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    update_at: Date;
}
