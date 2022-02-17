import { Record } from "immutable";

const Base = (defaultValues: object) => class extends Record({
  type: "empty",
  location: {story: undefined, index: undefined},
  next: undefined,
  background: undefined,
  class: undefined,
  notes: "",
  attribution: undefined,
  align: "",
  content: undefined,
  paths: undefined,
  options: undefined,
  ...defaultValues
}) {
}

export interface SlideLike {
  type: string,
  location: {story: string, index: number};
  next?: SlideLike;
  background?: string | object;
  class?: string;
  notes?: string;
  attribution?: object;
  align?: string;
  content?: string;
  paths?: Array<SlideLike | string>;
  options?: Array<string>;
}

export class ChatSlide extends Base({
  type: "chat"
}) { }

export class EmptySlide extends Base({}) { }

export class ForkSlide extends Base({
  type: "fork",
  paths: []
}) { }

export class PollSlide extends Base({
  type: "poll",
  options: []
}) { }

export class Slide extends Base({
  type: "slide"
}) { }

export class TitleSlide extends Base({
  type: "title"
}) { }
