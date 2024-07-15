import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
// import { format } from 'path';



@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepository: Repository<Position>,
  ) {}

  async findAll(): Promise<Position[]> {
    return this.positionsRepository.find();
  }

  async findOne(id: number): Promise<Position> {
    return this.positionsRepository.findOne({ where: { id } });
  }

  async create(positionData: Partial<Position>): Promise<Position> {
    const newPosition = this.positionsRepository.create(positionData);
    return this.positionsRepository.save(newPosition);
  }

  async update(id: number, positionData: Partial<Position>): Promise<Position> {
    await this.positionsRepository.update(id, positionData);
    return this.positionsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    try {
      // Check if the position has any children
      const children = await this.positionsRepository.find({
        where: { parentId: id },
      });
  
      // If there are children, do not allow deletion
      if (children.length > 0) {
        throw new Error('Cannot delete a parent position that has children.');
      }
  
      // If no children, proceed with deletion
      await this.positionsRepository.delete(id);
      console.log(`Position with id ${id} deleted successfully.`);
    } catch (error) {
      // Log the error message
      console.error('Error deleting position:', error.message);
      
      // Re-throw the error for further handling if necessary
      throw error;
    }
  }
  
//find childrens with the same parentid or association usind similartity
  async getChildren(positionId: number): Promise<Position[]> {
    const parentPosition = await this.positionsRepository.findOne({
      where: { id: positionId },
      relations: ['children'],
    });

    if (!parentPosition) {
      throw new Error(`Position with id ${positionId} not found`);
    }

    return parentPosition.children;
  }
 // Find the root position with id 1 or you prefere but on these project the id=1 because root not is not parent id 
  async getHierarchy(positionId: number): Promise<Position> {
    const root = await this.positionsRepository.findOne({
      where: { id: positionId },
      relations: ['children'],
    });
   

 // Handle the case where the position is not found
    if (!root) {
      throw new Error(`Position with id ${positionId} not found`);
    }
// Build the hierarchy starting from the root
    await this.buildHierarchy(root);

     // Return the root position with its full hierarchy
    return root;
  }
 // Fetch children for the current position
//  buildHierarchy method to recursively fetch and assign all 
// children to their respective parents.
  private async buildHierarchy(position: Position): Promise<void> {
    const children = await this.positionsRepository.find({
      where: { parentId: position.id },
      relations: ['children'],
    });
// Assign children to the current position
    position.children = children;
// Recursively build the hierarchy for each child
    for (const child of position.children) {
      await this.buildHierarchy(child);
    }
  }

  //only find the root node soon  ...............

// async getRootNode(): Promise<Position[]> {
//   return await this.positionsRepository.find({ where: { parentId: null } });
// }

async getRoot(): Promise<Position[]> {
  const rootNodes = await this.positionsRepository.find({
    where: { parentId: null },
    relations:[]
  });

  if (rootNodes.length === 0) {
    throw new NotFoundException('No root nodes found');
  }

  return rootNodes;
}


  //find  any children backtrace soon ...............
// Fetch the upward hierarchy starting from a given positionId
async getHierarchyUpwards(positionId: number): Promise<Position[]> {
   // Fetch the position with the given ID and its immediate parent
  const position = await this.positionsRepository.findOne({
    where: { id: positionId },
    relations: ['parent'],
  });

  // Handle the case where the position is not found
  if (!position) {
    throw new Error(`Position with id ${positionId} not found`);
  }
// Build the upward hierarchy starting from the current position
  const hierarchy = await this.buildHierarchyUpwards(position);
  return hierarchy;
}

// Recursively fetch parent positions
private async buildHierarchyUpwards(position: Position): Promise<Position[]> {
  const hierarchy: Position[] = [];
  let currentPosition = position;

  while (currentPosition) {
    hierarchy.unshift(currentPosition); // Add the current position to the start of the array
    currentPosition = currentPosition.parentId
      ? await this.positionsRepository.findOne({ where: { id: currentPosition.parentId } })
      : null;

        //? is used for true case 
        //: used for false
  }

  return hierarchy;
}
}


















// async getHierarchy(positionId: number): Promise<Position> {
//   const root = await this.positionsRepository.findOne({
//     where: { id: positionId },
//     relations: ['children'],
//   });

//   if (!root) {
//     throw new Error(`Position with id ${positionId} not found`);
//   }

//   return this.buildHierarchy(root);
// }

// private async buildHierarchy(position: Position): Promise<Position> {
//   const children = await this.positionsRepository.find({
//     where: { parentId: position.id },
//     relations: ['children'],
//   });

//   position.children = await Promise.all(
//     children.map(async child => await this.buildHierarchy(child)),
//   );

//   return position;
// }