import mongoose from "mongoose";

const trackingEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, 
  },
  type: {
    type: String,
    required: true,
    enum: ["PAGE_VIEW", "CLICK", "FORM_SUBMIT", "API_ERROR", "NAVIGATION", "SEARCH"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    required: false, 
  },
}, { timestamps: true });

export default mongoose.model("TrackingEvent", trackingEventSchema);