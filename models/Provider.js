import mongoose from 'mongoose'

const ProviderSchema = new mongoose.Schema({
  // Link to user account
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
  
  // NEW: City field (for future expansion)
  city: {
    type: String,
    required: [true, 'Please provide a city'],
    default: 'Ibadan',
  },
  
  // NEW: Areas array (replaces single location)
  areas: {
    type: [String],
    required: [true, 'Please provide at least one area'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Must serve at least one area'
    }
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
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for efficient queries
ProviderSchema.index({ city: 1, areas: 1, serviceType: 1 })

export default mongoose.models.Provider || mongoose.model('Provider', ProviderSchema)