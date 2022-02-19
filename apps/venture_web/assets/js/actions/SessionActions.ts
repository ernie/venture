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

  setKey(key: string) {
    AppDispatcher.dispatch({
      actionType: SessionConstants.SET_KEY,
      data: key
    });
  },

  skipKey() {
    AppDispatcher.dispatch({
      actionType: SessionConstants.SKIP_KEY
    });
  }

}

