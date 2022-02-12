import AppDispatcher from '../dispatcher/AppDispatcher';

import SelectionConstants from '../constants/SelectionConstants';

export default {

  receiveSelections(data) {
    AppDispatcher.dispatch({
      actionType: SelectionConstants.SELECTIONS_RECEIVED,
      data: data
    });
  }

};
