import "reflect-metadata";
import dotenv from 'dotenv'
import Server from './server/server.js'
import { AppDataSource } from './data-source'

dotenv.config()

const server = new Server()
server.listen()

AppDataSource.initialize().then(async(connection)=>{
  if (connection){
    console.log(`==> Connection with database successfully<==`)
  }
}).catch((error)=> console.log(error +' Connection a database failed')+ error)

