import { timeStamp } from 'console';
import mongoose, { Schema, Document, Types } from 'mongoose';

interface MeetingDocument extends Document {
  meeting_id: string;
  transcripts: Types.ObjectId[]; 
}

const MeetingSchema: Schema = new Schema({
  meeting_id: { type: String, required: true, unique: true },
  transcripts: [{ type: Schema.Types.ObjectId, ref: 'Transcript' }],
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);


const Meeting = mongoose.model<MeetingDocument>('Meeting', MeetingSchema);

export { Meeting, MeetingDocument };