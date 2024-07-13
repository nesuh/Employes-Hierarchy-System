import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Position> {
    return this.positionsService.findOne(+id);
  }

  @Post()
  create(@Body() positionData: Partial<Position>): Promise<Position> {
    return this.positionsService.create(positionData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() positionData: Partial<Position>): Promise<Position> {
    return this.positionsService.update(+id, positionData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.positionsService.remove(+id);
  }

  @Get(':id/children')
  getChildren(@Param('id') id: string): Promise<Position[]> {
    return this.positionsService.getChildren(+id);
  }

  //routing used to find entire hierarchy
  @Get(':id/hierarchy')
  async getHierarchy(@Param('id') id: string): Promise<Position> {
    return this.positionsService.getHierarchy(+id);
  }
  
  @Get('/root')
}
