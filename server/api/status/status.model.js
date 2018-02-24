'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './status.events';

var StatusSchema = new mongoose.Schema({
  device: String,
  percentage: Number,
  adc: Number,
  realVoltage: Number,
  charging: Number,
  timestamp: Date
});

registerEvents(StatusSchema);
export default mongoose.model('Status', StatusSchema);
