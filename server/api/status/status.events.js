/**
 * Status model events
 */

'use strict';

import {EventEmitter} from 'events';
var StatusEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StatusEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Status) {
  for(var e in events) {
    let event = events[e];
    Status.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    StatusEvents.emit(`${event}:${doc._id}`, doc);
    StatusEvents.emit(event, doc);
  };
}

export {registerEvents};
export default StatusEvents;
