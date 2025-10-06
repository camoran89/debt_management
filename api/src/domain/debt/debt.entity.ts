import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('debts')
export class DebtEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: false })
  is_paid: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  constructor(user_id: number, amount: number, is_paid = false, description?: string, paid_at?: Date) {
    this.user_id = user_id;
    this.amount = amount;
    this.is_paid = is_paid;
    if (description) this.description = description;
    if (paid_at) this.paid_at = paid_at;
  }
}
