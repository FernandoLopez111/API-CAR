import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId} from 'typeorm'
import {Rol} from './Rol'
import bcrypt from 'bcrypt'

@Entity()
export class User{
    @PrimaryGeneratedColumn("increment")
    id: number

    @ManyToOne(()=>Rol)
    rol: Rol

    @RelationId((user:User)=> user.rol)
    rolId: number

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string
    
    @Column({default:true})
    state: boolean

    hashPassword(): void {
    const salt = bcrypt.genSaltSync(10)
        this.password = bcrypt.hashSync(this.password, salt)
    }
   

}