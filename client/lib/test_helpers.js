export function keyPress(el, key) {
  if(document.createEventObject) {
    var eventObj = document.createEventObject();
    eventObj.keyCode = key;
    el.fireEvent('onkeydown', eventObj);
    eventObj.keyCode = key;
  } else if(document.createEvent) {
    var eventObj = document.createEvent('Events');
    eventObj.initEvent('keydown', true, true);
    eventObj.which = key;
    eventObj.keyCode = key;
    el.dispatchEvent(eventObj);
  }
}
