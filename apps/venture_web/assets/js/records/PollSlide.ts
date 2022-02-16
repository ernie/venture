import Immutable from 'immutable';

export default class PollSlide extends Immutable.Record({
  type: 'poll',
  location: {story: undefined, index: undefined},
  next: undefined,
  options: [],
  background: undefined,
  class: undefined,
  content: undefined,
  notes: '',
  attribution: undefined,
  align: ''
}) { }
