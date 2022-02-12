import Immutable from 'immutable';

export default class EmptySlide extends Immutable.Record({
  type: 'empty',
  location: {story: undefined, index: undefined},
  next: undefined,
  background: undefined,
  class: undefined,
  notes: '',
  attribution: undefined,
  align: ''
}) { }
