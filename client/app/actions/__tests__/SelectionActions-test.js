import { assert } from 'chai';

import SelectionActions from '../SelectionActions';
import SelectionConstants from '../../constants/SelectionConstants';

let mockDispatcher = {

  lastDispatch: {},

  dispatch(message) {
    this.lastDispatch = message;
  }

};

describe('SelectionActions', () => {

  before( () => {
    SelectionActions.__Rewire__('AppDispatcher', mockDispatcher);
  });

  after( () => {
    SelectionActions.__ResetDependency__('AppDispatcher');
  });

  it('dispatches for receiveSelections', () => {
    SelectionActions.receiveSelections({ selection: 2, selection2: 1 });
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: SelectionConstants.SELECTIONS_RECEIVED,
        data: { selection: 2, selection2: 1 }
      }
    );
  });

});
