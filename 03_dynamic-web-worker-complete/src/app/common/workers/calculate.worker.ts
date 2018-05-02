import {IWebWorkerMessage} from '../interfaces/web-worker-message';

// declarations for TS compatibility
declare var self: any;
declare function importScripts(...urls: string[]): void;

/**
 *
 * @param {IWebWorkerMessage} msg
 * @returns {IWebWorkerMessage}
 */
export function calculateWorker(msg: IWebWorkerMessage): IWebWorkerMessage {
  console.log('we are in calculateWorker!');
  
  if (Array.isArray(msg.imports) && msg.imports.every(m => typeof m === 'string')) {
    importScripts(...msg.imports);
  }
  
  if (!self.doCalculations) {
    const errMsg: string = `doCalculations function wasn't imported`;
    
    throw new Error(errMsg);
  }
  
  const data: number = self.doCalculations();
  
  return {id: msg.id, data};
}
