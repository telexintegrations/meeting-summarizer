import mongoose, { Schema, Document, Types } from 'mongoose';

interface TranscriptDocument extends Document {
  transcript: string;
  meeting: Types.ObjectId;
}

const TranscriptSchema: Schema = new Schema({
  transcript: { type: String, required: true },
  meeting: { type: Schema.Types.ObjectId, ref: 'Meeting', required: true },
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

const Transcript = mongoose.model<TranscriptDocument>('Transcript', TranscriptSchema);

export { Transcript, TranscriptDocument };