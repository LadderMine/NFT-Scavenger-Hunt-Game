import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm"
import { Exclude } from "class-transformer"
import * as bcrypt from "bcrypt"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 100 })
  name: string

  @Column({ unique: true, length: 20 })
  username: string

  @Column({ unique: true, length: 255 })
  email: string

  @Column()
  @Exclude() // Exclude password from serialization
  password: string

  @Column({ default: true })
  isActive: boolean

  @Column({ nullable: true })
  lastLoginAt: Date

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date


  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      const saltRounds = 12
      this.password = await bcrypt.hash(this.password, saltRounds)
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Only hash if password has been modified
    if (this.password && !this.password.startsWith("$2b$")) {
      const saltRounds = 12
      this.password = await bcrypt.hash(this.password, saltRounds)
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      console.error("Password validation error:", error)
      return false
    }
  }
}
