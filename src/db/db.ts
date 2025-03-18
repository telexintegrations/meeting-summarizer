import "reflect-metadata";
import { DataSource } from "typeorm";
import { Meeting } from "./meeting.entity";
import { Transcript } from "./transcript.entity";
import dotenv from "dotenv";


export const AppDataSource = new DataSource({
  type: "postgres",
  // url: process.env.DATABASE_URL,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password123",
  database: "zoom_bot",
  synchronize: true,
  logging: false,
  entities: [Meeting, Transcript],
});

// export const connectDB = async () => {
//   await AppDataSource.initialize();
//   console.log("✅ Database Connected!");
// };
export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database Connected!");
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    process.exit(1);
  }
};
