import {Injectable} from '@angular/core';
import {IWebWorkerMessage} from '../interfaces/web-worker-message';

/**
 * Web worker service;
 * can't be instantiated as a simple declaration in `providers` field, as it uses
 * non-injectable entity as an argument in a constructor function;
 * WARNING - dataHandler function should return exactly the same id in
 * returned object value as the one, passed to dataHandler itself;
 *
 * Usage:
 * 1) instantiate
 * 2) WebWorkerService.handle(requestData).then(responseData => ...)
 */
@Injectable()
export class WebWorkerService {
  /**
   * Unique id field; initialised as class property for typescript compatibility
   * (this property is set in constructor as a getter);
   */
  public uniqueId: number;
  /**
   * Reference to a worker
   * @type {null}
   * @private
   */
  private _worker: Worker = null;
  /**
   * Message map, that stores promise
   * @type {{}}
   * @private
   */
  private _messages: {
    [msgId: string]: {
      resolve: (data: any) => any
    }
  } = {};

  public constructor(private _dataHandler: (data: IWebWorkerMessage) => IWebWorkerMessage) {
    Object.defineProperty(this, 'uniqueId', {
      get: this._createIdGetter()
    });

    this._initWorker();
  }

  /**
   * Main public method of a service for requesting process of data by web worker;
   * results can be handled in .then handler of a promise, that is returned by this method;
   * @param data
   * @param imports
   * @returns {Promise<any>}
   */
  public handle({data, imports}: {data: any, imports: string[]}): Promise<any> {
    const message: IWebWorkerMessage = {
      id: this.uniqueId,
      data,
      imports
    };

    // reject function of a promise is not stored, as it's not used by service;
    // user of a service should indicate falsy/error situations within standard communication process;
    return new Promise<any>((resolve: (data: any) => any) => {
      this._messages[message.id] = {resolve};

      this._worker.postMessage(message);
    });
  }

  /**
   * Creates worker, initiates listeners for worker's events
   * @private
   */
  private _initWorker(): void {
    const workerCode: string = this._getWorkerCode();
    const workerBlob: Blob = new Blob([workerCode], {type: 'text/javascript'});
    const workerUrl: string = URL.createObjectURL(workerBlob);

    this._worker = new Worker(workerUrl);

    this._worker.addEventListener('message', this._handleWorkerResponse.bind(this));
    this._worker.addEventListener('error', this._handleWorkerError.bind(this));
  }

  /**
   * Gets worker code as a string (wraps data handler into worker listener function)
   * @returns {string}
   * @private
   */
  private _getWorkerCode(): string {
    const dataHandler: string = this._dataHandler.toString();

    return `
      self.addEventListener('message', function(e) {
        postMessage((${dataHandler})(e.data));
      });
    `;
  }

  /**
   * Handler of postMessage function, invoked inside web worker code
   * @param {MessageEvent} event
   * @private
   */
  private _handleWorkerResponse(event: MessageEvent): void {
    const message: IWebWorkerMessage = event.data;

    // coordinate web worker service users by blocking invalid postMessage function
    // invocation inside web worker code
    if (typeof message.id === 'undefined' || typeof message.data === 'undefined') {
      const errorMsg: string = 'Web worker `postMessage` function should be invoked with ' +
        'argument of type `{id: messageId, data: any}`, where `id` & `data` are defined.';

      throw new Error(errorMsg);
    } else if (typeof this._messages[message.id] === 'undefined') {
      const errorMsg: string = 'Web worker invokes `postMessage` function with incorrect ' +
        '`id` field. Use same message id, as was passed to web worker initially.';

      throw new Error(errorMsg);
    }

    // get message directly by id and send data to initially stored promise resolve handler
    this._messages[message.id].resolve(message.data);
  }

  /**
   * Handler of errors within web worker code
   * @param {ErrorEvent} event
   * @private
   */
  private _handleWorkerError(event: ErrorEvent): void {
    // an error inside web worker can't keep id of the message,
    // therefore `handle` request won't be resolved at all
    const errorMsg: string = 'Handle web worker errors inside web worker (indicate error ' +
      'situations within passed `data` field).';

    throw new Error(errorMsg);
  }

  /**
   * Encapsulates logic of id creating within creation of id getter;
   * also encourages use of scope as storage for inaccessible variables;
   * @returns {() => number}
   * @private
   */
  private _createIdGetter(): () => number {
    let idCounter: number = 0;

    return () => ++idCounter;
  }
}
