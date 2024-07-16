import { Controller, Get, Post, Put, Delete, Param, Body,ParseIntPipe } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';
import{PositionDto} from './Position.Dto';
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}
 // Find the root nodes

  //routing used to find entire hierarchy
  @Get('/hierarchy')
async getHierarchy():Promise<Position[]>{
   //@param is used to Extracts the id parameter from the request URL.
  return this.positionsService.getHierarchy();
}
 @Get('root-nodes')
 async getRoot(): Promise<Position[]> {
   return this.positionsService.getRoot();
 }
  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number): Promise<Position> {
   
    return this.positionsService.findOne(id);
  }

//Using Partial<Position> provides flexibility and ease
// of use for both the client and server,
// especially for operations that don’t 
//require all fields to be present.


@Post()
create(@Body() createPositionDto: PositionDto): Promise<Position> {
  return this.positionsService.create(createPositionDto);
}

@Put(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() updatePositionDto: PositionDto): Promise<Position> {
  return this.positionsService.update(id, updatePositionDto);
}

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id:number): Promise<void> {
    await this.positionsService.remove(id);
  }
  @Get(':id/children')
  getChildren(@Param('id',ParseIntPipe) id: number): Promise<Position[]> {
    // const positionId = parseInt(id, 10);
    // if (isNaN(positionId)) {
    //   throw new Error('Invalid id  when children out put parameter');
    // }
    return this.positionsService.getChildren(id);
  }



  

  @Get(':id/hierarchy-upwards')
  async getHierarchyUpwards(@Param('id', ParseIntPipe) id: number, ): Promise<Position[]> {
    return this.positionsService.getHierarchyUpwards(id);
  }
  

}
