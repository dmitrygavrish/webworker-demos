import {IWebWorkerMessage} from '../interfaces/web-worker-message';
import {CALCULATE_WEB_WORKER_SERVICE} from '../../config/tokens';
import {Provider} from '@angular/core';
import {WebWorkerService} from '../services/web-worker.service';

/**
 * Used by calculateWebWorkerServiceProvider function;
 * Exported function is required for AOT mode
 * (can't just place this function inside calculateWebWorkerServiceProvider function);
 * @param {(data: IWebWorkerMessage) => IWebWorkerMessage} dataHandler
 * @returns {WebWorkerService}
 */
export function createWebWorkerService(
  dataHandler: (data: IWebWorkerMessage) => IWebWorkerMessage
): WebWorkerService {
  return new WebWorkerService(dataHandler);
}

/**
 *
 * @param {(data: IWebWorkerMessage) => IWebWorkerMessage} dataHandler
 * @returns {Provider}
 */
export function calculateWebWorkerServiceProvider(
  dataHandler: (data: IWebWorkerMessage) => IWebWorkerMessage
): Provider {
  return {
    provide: CALCULATE_WEB_WORKER_SERVICE,
    useFactory: createWebWorkerService,
    deps: [dataHandler]
  };
}
