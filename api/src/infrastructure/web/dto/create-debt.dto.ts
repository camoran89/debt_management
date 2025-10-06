import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtDto {
  @ApiProperty({ example: 1, description: 'ID del usuario asociado a la deuda' })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 'Préstamo para almuerzo', description: 'Descripción de la deuda', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 25.50, description: 'Monto de la deuda (debe ser positivo)' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser positivo' })
  amount: number;

  constructor(user_id: number, amount: number, description?: string) {
    this.user_id = user_id;
    this.amount = amount;
    if (description) this.description = description;
  }
}
