import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    RelationId,
  } from "typeorm";
  import { Car } from "./Car";
  
  @Entity()
  export class Client {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @ManyToOne(() => Car)
    car: Car;
    @RelationId((client: Client) => client.car)
    carId: number;
    @Column()
    name: string;
    @Column()
    phone: number;
    @Column({ default: 0 })
    points: number;
    @Column({ default: true })
    state: boolean;
  }
  