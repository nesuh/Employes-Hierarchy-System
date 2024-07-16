
export class PositionDto {
    name: string;
    description: string;
    parentId?: number;
  }
  















































































  // async getHierarchy(): Promise<Position[]> {
  //   const positions = await this.positionsRepository.find();
  //   const positionMap = new Map<number, Position>();
    
  // console.log(positions)
  //   console.log(positions)
  //   positions.forEach(position => {
  //     positionMap.set(position.id, { ...position, children: [] });
  //   });
  
   
  //   const buildHierarchy = (position: Position): Position => {
  //     const children = positions.filter(pos => pos.parentId == position.id);
  //     children.forEach(child => {
  //       const childNode = buildHierarchy(child);
  //       positionMap.get(position.id).children.push(childNode);
  //     });
  //     return positionMap.get(position.id);
  //   };
  
   
  //   const roots: Position[] = positions.filter(position => !position.parentId);
  
  //   // Build and return the tree structure starting from the roots
  //   return roots.map(root => buildHierarchy(root));
  // }
  // async getRoot(): Promise<Position[]> {
  
  //   const rootNodes = await this.positionsRepository.find({
  //     where: { parentId: null },
  //     relations:[]
  //   });
  
  //   if (rootNodes.length === 0) {
  //     throw new NotFoundException('No root nodes found');
  //   }
  
  //   return rootNodes;
  // }
  
//   async create(positionData: Partial<Position>): Promise<Position> {
//     const newPosition = this.positionsRepository.create(positionData);
//     return this.positionsRepository.save(newPosition);
//   }

//   async update(id: number, positionData: Partial<Position>): Promise<Position> {
//     await this.positionsRepository.update(id, positionData);
//     return this.positionsRepository.findOne({ where: { id } });
//   }

 

 // Find the root position with id 1 or you prefere but on these project the id=1 because root not is not parent id 
  //only find the root node soon  ...............

// async getRootNode(): Promise<Position[]> {
//   return await this.positionsRepository.find({ where: { parentId: null } });
// }

// // Main method to get the hierarchy
// async getHierarchy(positionId: number): Promise<Position> {
//   // Fetch all positions in a single query
//   const allPositions = await this.positionsRepository.find({
//    relations: ['children'],
//   });

//   // Handle the case where the root position is not found
//   const root = allPositions.find(pos => pos.id === positionId);
//   if (!root) {
//     throw new Error(`Position with id ${positionId} not found`);
//   }

//   // Build the hierarchy starting from the root
//   this.buildHierarchy(root, allPositions);

//   // Return the root position with its full hierarchy
//   return root;
// }

// // Recursive method to build the hierarchy
// private buildHierarchy(position: Position, allPositions: Position[]): void {
//   // Find and assign children to the current position
//   position.children = allPositions.filter(pos => pos.parentId === position.id);

//   // Recursively build the hierarchy for each child
//   for (const child of position.children) {
//     this.buildHierarchy(child, allPositions);
//   }
// }







// @Put(':id')
// update(@Param('id',ParseIntPipe) id: number, @Body() positionData: Partial<Position>): Promise<Position> {
//   return this.positionsService.update(id, positionData);
// }

// @Delete(':id')
// async remove(@Param('id',ParseIntPipe) id:number): Promise<void> {
//   await this.positionsService.remove(id);
// }


// async getHierarchy(): Promise<Position[]> {
//     const positions = await this.positionsRepository.find();
//     const positionMap = new Map<number, Position>();
    
//   console.log(positions)
//   console.log(positions)
//     positions.forEach(position => {
//       positionMap.set(position.id, { ...position, children: [] });
//     });
  
   
//     const buildHierarchy = (position: Position): Position => {
//       const children = positions.filter(pos => pos.parentId == position.id);
//       children.forEach(child => {
//         const childNode = buildHierarchy(child);
//         positionMap.get(position.id).children.push(childNode);
//       });
//       return positionMap.get(position.id);
//     };
  
   
//     const roots: Position[] = positions.filter(position => !position.parentId);
  
//     // Build and return the tree structure starting from the roots
//     return roots.map(root => buildHierarchy(root));
//   }
//   async getRoot(): Promise<Position[]> {
  
//     const rootNodes = await this.positionsRepository.find({
//       where: { parentId: null },
//       relations:[]
//     });
  
//     if (rootNodes.length === 0) {
//       throw new NotFoundException('No root nodes found');
//     }
  
//     return rootNodes;
//   }
  