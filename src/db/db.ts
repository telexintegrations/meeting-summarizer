import "reflect-metadata";
import { DataSource } from "typeorm";
import { Meeting } from "./meeting.entity";
import { Transcript } from "./transcript.entity";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Meeting, Transcript],
});

export const connectDB = async () => {
  await AppDataSource.initialize();
  console.log("✅ Database Connected!");
};
