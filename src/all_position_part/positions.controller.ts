import { Controller, Get, Post, Put, Delete, Param, Body,ParseIntPipe } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}
 // Find the root nodes


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
  create(@Body() positionData: Partial<Position>): Promise<Position> {
    return this.positionsService.create(positionData);
  }


  // On My Way I prefferer to use Partial<T> best of best other than intrfere....
  @Put(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() positionData: Partial<Position>): Promise<Position> {
    // const positionId = parseInt(id, 10);
    // if (isNaN(positionId)) {
    //   throw new Error('Invalid id when update parameter');
    // }
    return this.positionsService.update(id, positionData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const positionId = parseInt(id, 10);
    if (isNaN(positionId)) {
      throw new Error('Invalid id when delete parameter');
    }
    await this.positionsService.remove(positionId);
  }
  @Get(':id/children')
  getChildren(@Param('id',ParseIntPipe) id: number): Promise<Position[]> {
    // const positionId = parseInt(id, 10);
    // if (isNaN(positionId)) {
    //   throw new Error('Invalid id  when children out put parameter');
    // }
    return this.positionsService.getChildren(id);
  }


  //routing used to find entire hierarchy
  @Get(':id/hierarchy')
async getHierarchy(@Param('id',ParseIntPipe) id:number):Promise<Position>{
   //@param is used to Extracts the id parameter from the request URL.
  return this.positionsService.getHierarchy(+id);
}
   
  

  @Get(':id/hierarchy-upwards')
  async getHierarchyUpwards(@Param('id', ParseIntPipe) id: number, ): Promise<Position[]> {
    return this.positionsService.getHierarchyUpwards(id);
  }
  

}
