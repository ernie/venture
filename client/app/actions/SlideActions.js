import AppDispatcher from '../dispatcher/AppDispatcher';

import SlideConstants from '../constants/SlideConstants';

export default {

  receiveSlide(data) {
    AppDispatcher.dispatch({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: data
    });
  },

  nextSlide(channel) {
    channel.push('next');
  },

  prevSlide(channel) {
    channel.push('prev');
  },

  resetPresentation(channel) {
    channel.push('reset');
  },

  reloadDeck(channel) {
    channel.push('reload');
  },

  selectOption(channel, option) {
    channel.push('select', {option: option});
  }

};
