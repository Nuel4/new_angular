import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class GlobalState {

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this._dataStream$.subscribe((data) => this._onEvent(data));
  }

  notifyDataChanged(key, value) {

    let current = this._data[key];
    if (current !== value) {
      this._data[key] = value;

      this._data.next({
        Key: key,
        Value: this._data[key]
      });
    }
  }

  subscribe(key: string, callback: Function) {
    let subscribers = this._subscriptions.get(key) || [];
    subscribers.push(callback);

    this._subscriptions.set(key, subscribers);
  }

  private _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['Key']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['Value']);
    });
  }
}
