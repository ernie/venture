import Flux from 'flux';

export interface Action {
  actionType: string;
  data: any;
}

export default new Flux.Dispatcher();
