import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm'

@Entity()

export class Model{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    typemodel: string
    @Column({default:true})
    state: boolean
}