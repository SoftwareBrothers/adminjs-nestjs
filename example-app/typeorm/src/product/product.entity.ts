import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('products')
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public cost!: number;

  @Column()
  public count!: number;
}