import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@example.com', description: 'Email del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo', required: false })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ example: '+1234567890', description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  constructor(email: string, password: string, full_name?: string, phone?: string) {
    this.email = email;
    this.password = password;
    if (full_name) this.full_name = full_name;
    if (phone) this.phone = phone;
  }
}
