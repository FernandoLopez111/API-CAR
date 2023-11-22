import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId,CreateDateColumn} from 'typeorm'
import { Client } from './Client'
@Entity()
export class CarWash{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    type:string
    @Column()
    price:number
    @ManyToOne(() => Client)
    client: Client;
    @RelationId((carwash:CarWash) => carwash.client)
    clientId: number;
    @Column()
    amount: number;
    @Column()
    @CreateDateColumn()
    date: Date;
    @Column({ default: 0 })
    subTotal: number;
    @Column({ default: 0 })
    total: number;
   @Column({default:true})
   state: boolean
  }