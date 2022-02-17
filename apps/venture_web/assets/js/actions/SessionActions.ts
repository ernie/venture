import AppDispatcher from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';

interface JoinData {
  slide: object;
  selections: object;
  connections?: object;
}

export default {

  handleConnection(data: JoinData) {
    AppDispatcher.dispatch({
      actionType: SessionConstants.CONNECTED,
      data: data
    });
  },

  setToken(token: string) {
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

