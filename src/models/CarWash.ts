import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId,CreateDateColumn} from 'typeorm'
import { Client } from './Client'
@Entity()
export class CarWash{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type:string

    @Column({type:'decimal', precision: 5, scale:2, default:0})
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

    @Column({ type:'decimal', precision: 5, scale:2, default:0})
    subTotal: number;
    
    @Column({type:'decimal', precision: 5, scale:2, default:0})
    total: number;

    @Column({default:true})
    state: boolean
  }