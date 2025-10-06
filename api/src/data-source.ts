import { DataSource } from 'typeorm';
import { UserEntity } from './domain/user/user.entity';
import { DebtEntity } from './domain/debt/debt.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'debt_management',
  entities: [UserEntity, DebtEntity],
  synchronize: false,
  logging: true,
});
