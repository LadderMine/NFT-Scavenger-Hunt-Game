import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  puzzleId: string;

  @Column()
  content: string;

  @Column()
  unlockTimeInMinutes: number;
}
