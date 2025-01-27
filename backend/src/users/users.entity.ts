import { UserProgress } from "src/user-progress/userprogress.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @OneToMany(
    () => UserProgress,
    (userProgress) => userProgress.user,
  )
  userProgress: UserProgress[]

}

