import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,IsNull } from 'typeorm';
import { Position } from './position.entity';
// import { format } from 'path';
import { PositionDto} from './Position.Dto';


@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionsRepository: Repository<Position>,
  ) {}

  async findAll(): Promise<Position[]> {
    const store=this.positionsRepository.find();
    return this.positionsRepository.find();

  }
  

  async findOne(id: number): Promise<Position> {
    return this.positionsRepository.findOne({ where: { id } });
  }

 async create(createPositionDto: PositionDto): Promise<Position> {
    const position = new Position();
    position.name = createPositionDto.name;
    position.description = createPositionDto.description;
    position.parent = createPositionDto.parentId ? { id: createPositionDto.parentId } as Position : null;
    return this.positionsRepository.save(position);
  }

  async update(id: number, updatePositionDto: PositionDto): Promise<Position> {
    const position = await this.findOne(id);
    if (!position) {
      throw new NotFoundException(`Position with id ${id} not found`);
    }
    position.name = updatePositionDto.name || position.name;
    position.description = updatePositionDto.description || position.description;
    position.parent = updatePositionDto.parentId ? { id: updatePositionDto.parentId } as Position : position.parent;
    return this.positionsRepository.save(position);
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

async getHierarchy(): Promise<Position[]> {
  const positions = await this.positionsRepository.find();
  const positionMap = new Map<number, Position>();
  positions.forEach(position => {
    positionMap.set(position.id, { ...position, children: [] });
  });
//... means spread operator
  const buildHierarchy = (position: Position): Position => { 
    const children = positions.filter(pos => pos.parentId == position.id);
    children.forEach(child => {
      const childNode = buildHierarchy(child);
   positionMap.get(position.id).children.push(childNode);
    });
    return positionMap.get(position.id);
  };
  const roots: Position[] = positions.filter(position => !position.parentId);
console.log(roots)
  // Build and return the tree structure starting from the roots
  return roots.map(root => buildHierarchy(root));
}

async getRoot(): Promise<Position[]> {
  const rootNodes = await this.positionsRepository.find({
    where: { parentId: IsNull() },
    relations:[]
  });

  if (rootNodes.length === 0) {
    throw new NotFoundException('No root nodes found');
  }

  return rootNodes;
}


async getHierarchyUpwards(positionId: number): Promise<Position[]> {
  // Fetch all positions from the repository
  const positions = await this.positionsRepository.find();

  // Create a map to store positions by their IDs
  const positionMap = new Map<number, Position>();
  positions.forEach(position => positionMap.set(position.id, position));

  // Find the starting position
  const startPosition = positionMap.get(positionId);
  if (!startPosition) {
    throw new Error(`Position with id ${positionId} not found`);
  }

  // Build the upward hierarchy starting from the current position
  const hierarchy = this.buildHierarchyUpwards(startPosition, positionMap);
  return hierarchy;
}

// Build the upward hierarchy using a map of positions
private buildHierarchyUpwards(position: Position, positionMap: Map<number, Position>): Position[] {
  const hierarchy: Position[] = [];
  let currentPosition = position;

  while (currentPosition) {
    hierarchy.unshift(currentPosition); // Add the current position to the start of the array
    currentPosition = currentPosition.parentId ? positionMap.get(currentPosition.parentId) : null;
  }

  return hierarchy;
}

}








 






// async getHierarchy(positionId: number): Promise<Position> {
//   const root = await this.positionsRepository.findOne({
//     where: { id: positionId },
//     relations: ['children'],
//   });
 

// // Handle the case where the position is not found
//   if (!root) {
//     throw new Error(`Position with id ${positionId} not found`);
//   }
// // Build the hierarchy starting from the root
//   await this.buildHierarchy(root);

//    // Return the root position with its full hierarchy
//   return root;
// }
// // Fetch children for the current position
// //  buildHierarchy method to recursively fetch and assign all 
// // children to their respective parents.
// private async buildHierarchy(position: Position): Promise<void> {

//   const children = await this.positionsRepository.find({
//     where: { parentId: position.id },
//     relations: ['children'],
//   });
// // Assign children to the current position
//   position.children = children;
// // Recursively build the hierarchy for each child
//   for (const child of position.children) {
//     await this.buildHierarchy(child);
//   }
// }


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