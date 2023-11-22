import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()

export class Brand{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    type: string
    @Column({default:true})
    state: boolean
}