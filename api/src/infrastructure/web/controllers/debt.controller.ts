import { Body, Controller, Get, Post, Param, Patch, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { DebtService } from '../../../application/debt/debt.service';
import { CreateDebtDto } from '../dto/create-debt.dto';
import { UpdateDebtDto } from '../dto/update-debt.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('debts')
@ApiBearerAuth()
@Controller('debts')
@UseGuards(AuthGuard('jwt'))
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @ApiOperation({ summary: 'Crear nueva deuda' })
  @ApiResponse({ status: 201, description: 'Deuda creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateDebtDto })
  @Post()
  async create(@Body() createDebtDto: CreateDebtDto, @Req() req: Request & { user: any }) {
    return this.debtService.create(createDebtDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Listar deudas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de deudas' })
  @Get()
  async findAll(@Req() req: Request & { user: any }) {
    return this.debtService.findAllByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Obtener deuda por ID' })
  @ApiResponse({ status: 200, description: 'Deuda encontrada' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.debtService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar deuda' })
  @ApiResponse({ status: 200, description: 'Deuda actualizada' })
  @ApiResponse({ status: 403, description: 'No se puede modificar una deuda pagada' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @ApiBody({ type: UpdateDebtDto })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(id, updateDebtDto);
  }

  @ApiOperation({ summary: 'Eliminar deuda' })
  @ApiResponse({ status: 204, description: 'Deuda eliminada' })
  @ApiResponse({ status: 403, description: 'No se puede eliminar una deuda pagada' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number) {
    await this.debtService.remove(id);
  }

  @ApiOperation({ summary: 'Marcar deuda como pagada' })
  @ApiResponse({ status: 200, description: 'Deuda marcada como pagada' })
  @ApiResponse({ status: 403, description: 'La deuda ya está pagada' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @Patch(':id/pay')
  async markAsPaid(@Param('id') id: number) {
    return this.debtService.markAsPaid(id);
  }
}
