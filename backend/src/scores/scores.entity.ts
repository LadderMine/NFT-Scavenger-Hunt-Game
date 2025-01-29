import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Scores {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;
    
    @Column({ type: 'int', default: 0 })
    score:number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    update_at:Date;
}
