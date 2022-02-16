import Immutable from 'immutable';

export default class ChatSlide extends Immutable.Record({
  type: 'chat',
  location: {story: undefined, index: undefined},
  next: undefined,
  background: undefined,
  class: undefined,
  content: undefined,
  notes: '',
  attribution: undefined,
  align: ''
}) { }
