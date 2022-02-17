import AppDispatcher from "../dispatcher/AppDispatcher";
import { Channel } from "phoenix";

import SlideConstants from "../constants/SlideConstants";

export default {

  receiveSlide(data: object) {
    AppDispatcher.dispatch({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: data
    });
  },

  nextSlide(channel: Channel) {
    channel.push("next", {});
  },

  prevSlide(channel: Channel) {
    channel.push("prev", {});
  },

  resetPresentation(channel: Channel) {
    channel.push("reset", {});
  },

  reloadDeck(channel: Channel) {
    channel.push("reload", {});
  },

  selectOption(channel: Channel, option: string) {
    channel.push("select", {option: option});
  }

};
