import mongoose from "mongoose";

// Preset Schema
const presetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filters: { type: Array, required: true },
  logic: { type: String, default: 'AND' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const Preset = mongoose.model('Preset', presetSchema);

export default Preset