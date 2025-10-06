import { Body, Controller, Post, HttpException, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from '../../../application/user/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const exists = await this.userService.findByEmail(createUserDto.email);
    if (exists) {
      throw new HttpException('Email ya registrado', HttpStatus.CONFLICT);
    }
    const user = await this.userService.create(createUserDto);
    return { id: user.id, email: user.email, full_name: user.full_name, phone: user.phone, created_at: user.created_at };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
