'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './reading.events';

var ReadingSchema = new mongoose.Schema({
  device: String,
  temperature: Number,
  humidity: Number,
  percentage: Number,
  adc: Number,
  realVoltage: Number,
  charging: Number,
  timestamp: Date
});

registerEvents(ReadingSchema);
export default mongoose.model('Reading', ReadingSchema);
