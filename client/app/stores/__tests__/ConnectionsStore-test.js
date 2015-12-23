import { assert } from 'chai';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ConnectionsStore from '../ConnectionsStore';

import SessionConstants from '../../constants/SessionConstants';
import ConnectionConstants from '../../constants/ConnectionConstants';

import Chat from '../../records/Chat';

let callback = AppDispatcher._callbacks[ConnectionsStore.dispatchToken];

describe('ConnectionsStore', () => {

  beforeEach( () => {
    ConnectionsStore.connections = {};
    AppDispatcher._isDispatching = true;
    sinon.stub(AppDispatcher, 'waitFor');
  });

  afterEach( () => {
    AppDispatcher._isDispatching = false;
    AppDispatcher.waitFor.restore();
  });

  it('sets connections on connection', () => {
    let listener = sinon.spy();
    ConnectionsStore.addChangeListener(listener);
    callback({
      actionType: SessionConstants.CONNECTED,
      data: { connections: { attendees: 2, presenters: 1 } }
    });
    ConnectionsStore.removeChangeListener(listener);
    assert.deepEqual(ConnectionsStore.get(), { attendees: 2, presenters: 1 });
    assert.isTrue(listener.called);
  });

  it('sets connections on connections received', () => {
    let listener = sinon.spy();
    ConnectionsStore.addChangeListener(listener);
    callback({
      actionType: ConnectionConstants.CONNECTIONS_RECEIVED,
      data: { attendees: 2, presenters: 1 }
    });
    ConnectionsStore.removeChangeListener(listener);
    assert.deepEqual(ConnectionsStore.get(), { attendees: 2, presenters: 1 });
    assert.isTrue(listener.called);
  });

});
