import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()
export class Car{

    @PrimaryGeneratedColumn()
    id: number

    @Column()

    owner: string

    @Column()

    brand : string
    
    @Column({default:true})
    state: boolean

    
}