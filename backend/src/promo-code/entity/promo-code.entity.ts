import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  @Index()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @IsNumber()
  discount: number;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  expirationDate: Date;

  @Column({ type: 'boolean', default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Method to check if promo code is valid
  isValid(): boolean {
    return this.isActive && 
           (!this.expirationDate || this.expirationDate > new Date());
  }
}