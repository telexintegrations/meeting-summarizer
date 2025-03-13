import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";
import { Meeting } from "./meeting.entity";

@Entity()
export class Transcript extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.transcripts, {
    onDelete: "CASCADE",
  })
  @Column("uuid")
  meeting!: Meeting;

  @Column("text")
  transcript!: string;

  @CreateDateColumn()
  created_at!: Date;
}
