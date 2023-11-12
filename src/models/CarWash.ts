import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, RelationId} from 'typeorm'
import {Car} from './Car'

@Entity()
export class CarWash{
    @PrimaryGeneratedColumn("increment")
    id: number
    @ManyToMany(()=>Car)
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