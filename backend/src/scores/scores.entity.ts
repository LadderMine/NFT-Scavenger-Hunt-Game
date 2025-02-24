import { Puzzles } from 'src/puzzles/puzzles.entity';
import { UserProgress } from 'src/user-progress/UserProgress.entity';
import { User } from 'src/users/users.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Scores {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;
    
    @Column({ type: 'int', default: 0 })
    score:number;
    
    @ManyToOne(() => User, (user) => user.scores, { onDelete: "CASCADE" })
    user: User;
  
    @ManyToOne(() => Puzzles, (puzzles) => puzzles.scores, { onDelete: "CASCADE" })
    puzzles: Puzzles;
  
    @ManyToOne(() => UserProgress, (userProgress) => userProgress.scores, { cascade: true })
    userProgress: UserProgress;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    update_at:Date;
}
