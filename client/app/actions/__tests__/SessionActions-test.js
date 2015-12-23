import { assert } from 'chai';

import SessionActions from '../SessionActions';
import SessionConstants from '../../constants/SessionConstants';

let mockDispatcher = {

  lastDispatch: {},

  dispatch(message) {
    this.lastDispatch = message;
  }

};

describe('SessionActions', () => {

  before( () => {
    SessionActions.__Rewire__('AppDispatcher', mockDispatcher);
  });

  after( () => {
    SessionActions.__ResetDependency__('AppDispatcher');
  });

  it('dispatches for handleConnection', () => {
    SessionActions.handleConnection({ connection: 'data' });
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: SessionConstants.CONNECTED,
        data: { connection: 'data' }
      }
    );
  });

  it('dispatches for setToken', () => {
    SessionActions.setToken('token');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: SessionConstants.SET_TOKEN,
        data: 'token'
      }
    );
  });

  it('dispatches for skipToken', () => {
    SessionActions.skipToken();
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: SessionConstants.SKIP_TOKEN
      }
    );
  });

});
