
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  
    required: true,
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: 'Video',  
    required: true,
  }
}, {
  timestamps: true 
});

export const Comment = model('Comment', commentSchema);
