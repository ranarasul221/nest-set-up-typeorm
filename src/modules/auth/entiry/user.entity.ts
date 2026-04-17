import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  // ✅ FIXED (VERY IMPORTANT)
  @Column({ type: 'varchar', nullable: true })
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  resetOtp?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetOtpExpiresAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string;
}