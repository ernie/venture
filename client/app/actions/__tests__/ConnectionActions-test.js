import { assert } from 'chai';

import ConnectionActions from '../ConnectionActions';
import ConnectionConstants from '../../constants/ConnectionConstants';

let mockDispatcher = {

  lastDispatch: {},

  dispatch(message) {
    this.lastDispatch = message;
  }

};

describe('ConnectionActions', () => {

  before( () => {
    ConnectionActions.__Rewire__('AppDispatcher', mockDispatcher);
  });

  after( () => {
    ConnectionActions.__ResetDependency__('AppDispatcher');
  });

  it('dispatches for receiveConnections', () => {
    ConnectionActions.receiveConnections(['these', 'are', 'connections']);
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ConnectionConstants.CONNECTIONS_RECEIVED,
        data: ['these', 'are', 'connections']
      }
    );
  });

});
