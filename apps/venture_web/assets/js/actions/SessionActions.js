import AppDispatcher from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';

export default {

  handleConnection(data) {
    AppDispatcher.dispatch({
      actionType: SessionConstants.CONNECTED,
      data: data
    });
  },

  setToken(token) {
    AppDispatcher.dispatch({
      actionType: SessionConstants.SET_TOKEN,
      data: token
    });
  },

  skipToken() {
    AppDispatcher.dispatch({
      actionType: SessionConstants.SKIP_TOKEN
    });
  }

}

