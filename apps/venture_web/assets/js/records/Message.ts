import Immutable from 'immutable';

export default class Message extends Immutable.Record({
  type: 'normal',
  sender: undefined,
  recipient: undefined,
  content: undefined
}) { }
