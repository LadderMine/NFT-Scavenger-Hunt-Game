import { Post } from 'src/posts/posts.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['postId', 'userId']) // Ensures a user can react only once per post
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.reactions, { onDelete: 'CASCADE' })
  post: Post;

  @Column()
  userId: number;

  @Column({ type: 'enum', enum: ['like', 'dislike', 'love', 'haha', 'wow', 'sad', 'angry'], default: 'like' })
  reactionType: string;

  @CreateDateColumn()
  createdAt: Date;
}