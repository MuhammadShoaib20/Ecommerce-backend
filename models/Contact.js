import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email']
  },
  subject: {
    type: String,
    required: [true, 'Please enter subject']
  },
  message: {
    type: String,
    required: [true, 'Please enter your message']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Contact', contactSchema);