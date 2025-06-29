import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const { Schema, model } = mongoose;

const videoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
  video: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, {
  timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate)
const Video = model('Video', videoSchema);

export default Video;
