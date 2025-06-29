
import mongoose,{Schema,model} from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true
  },
    channelname: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatarImage: {
    type: String, 
    default: ''  
  },
  coverImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true 
});

export const User = mongoose.model('User', userSchema);
