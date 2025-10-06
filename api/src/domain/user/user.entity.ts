import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  full_name?: string;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  created_at?: Date;
  constructor(email: string, password: string, full_name?: string, phone?: string) {
    this.email = email;
    this.password = password;
    if (full_name) this.full_name = full_name;
    if (phone) this.phone = phone;
  }
}
