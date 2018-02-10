/**
 * Reading model events
 */

'use strict';

import {EventEmitter} from 'events';
var ReadingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ReadingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Reading) {
  for(var e in events) {
    let event = events[e];
    Reading.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    ReadingEvents.emit(`${event}:${doc._id}`, doc);
    ReadingEvents.emit(event, doc);
  };
}

export {registerEvents};
export default ReadingEvents;
