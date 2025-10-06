import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDebtDto {
  @ApiProperty({ example: 'Préstamo actualizado', description: 'Nueva descripción de la deuda', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 30.00, description: 'Nuevo monto de la deuda', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'El monto debe ser positivo' })
  amount?: number;
}
