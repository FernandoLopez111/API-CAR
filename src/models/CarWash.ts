import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId} from 'typeorm'
import {Car} from './Car'

@Entity()
export class CarWash{

    @PrimaryGeneratedColumn()

    id: number

    @ManyToOne(()=>Car)
    car : Car

    @RelationId((carwash: CarWash)=>carwash.car)
    carId: number


    @Column()

    service: string

    @Column()
    
    price: string
    
    @Column({default:true})
    state: boolean
}