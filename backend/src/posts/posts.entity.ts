import { Reaction } from 'src/reactions/reactions.entity';
import { Comment } from 'src/comments/comments.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.post, { cascade: true })
  reactions: Reaction[];
}