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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    update_at: Date;
}
