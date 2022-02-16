import Immutable from 'immutable';

export default class ForkSlide extends Immutable.Record({
  type: 'fork',
  location: {story: undefined, index: undefined},
  next: undefined,
  paths: [],
  background: undefined,
  class: undefined,
  content: undefined,
  notes: '',
  attribution: undefined,
  align: ''
}) { }
