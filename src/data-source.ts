import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
host:"localhost",
username: "root",
password: "password",
port: 3306,
  database:  "carwash-api",
  synchronize: true,
logging: true,
entities: ["dist/models/**/*.js"],
subscribers: ["dist/subscribers/**/*.js"],
migrations:["dist/migrations/**/*.js"]

 })
