import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  parentId: number;


  //each Position can have one parent Position, 
  //but a parent Position can have many children
  @ManyToOne(() => Position, position => position.children, { nullable: true })
  
  // the foreign key column that will be used to store the relationship in the database.
  @JoinColumn({ name: 'parentId' })
  parent: Position;

  @OneToMany(() => Position, position => position.parent)
  children: Position[];
}
