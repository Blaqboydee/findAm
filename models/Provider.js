import mongoose from 'mongoose'

const ProviderSchema = new mongoose.Schema({
  // NEW: Link to user account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  serviceType: {
    type: String,
    required: [true, 'Please provide a service type'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  profileImage: {
    type: String,
    default: null,
  },
  workImages: {
    type: [String],
    default: [],
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // NEW: Track if provider is active
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Provider || mongoose.model('Provider', ProviderSchema)