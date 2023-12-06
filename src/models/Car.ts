import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId} from 'typeorm'
import {Brand} from './Brand'
import {Model} from './Model'



@Entity()
export class Car{
    @PrimaryGeneratedColumn("increment")
    id: number
    @ManyToOne(()=> Brand)
    brand: Brand
    @RelationId((car:Car)=>car.brand)
    brandId : number
    @ManyToOne(()=> Model)
    model: Model
    @RelationId((car:Car)=>car.model)
    modelId : number
    @Column()
    color: string
    @Column()
    serialnumber : string
    @Column({default:true})
    state: boolean
   
}