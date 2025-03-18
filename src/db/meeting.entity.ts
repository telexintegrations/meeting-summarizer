import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Transcript } from "./transcript.entity";

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar", { unique: true })
  meeting_id!: string;

  @Column("varchar")
  title!: string;

  @Column("timestamp")
  start_time!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Transcript, (transcript) => transcript.meeting_id, {
    cascade: true,
  })
  transcripts!: Transcript[];
}
