/**
 * Interface of an object, that is passed between main thread & web worker;
 * @param id - helps identify request
 * @param data - any data, that will be processed by web worker
 * @param imports - urls for JS scripts, that need to be imported in web worker
 */
export interface IWebWorkerMessage {
  id: number;
  data: any;
  imports?: string[];
}
