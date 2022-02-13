import Immutable from "immutable";

export default class Slide extends Immutable.Record({
  type: "slide",
  location: {story: undefined, index: undefined},
  next: undefined,
  background: undefined,
  class: undefined,
  content: undefined,
  notes: "",
  attribution: undefined,
  align: ""
}) { }
