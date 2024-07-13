import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';

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
    await this.positionsRepository.delete(id);
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




  //find  any children backtrace soon ...............
  
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