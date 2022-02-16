import Immutable from 'immutable';

export default class TitleSlide extends Immutable.Record({
  type: 'title',
  location: {story: undefined, index: undefined},
  next: undefined,
  background: undefined,
  class: undefined,
  content: undefined,
  notes: '',
  attribution: undefined,
  align: ''
}) { }
