import { Injectable } from '@angular/core';
import { events } from 'grid3_client';

import { Observable, Subject } from 'rxjs';
import { tap, catchError, take } from 'rxjs/operators';

export class LogInfo {
  type = 'log';
  constructor(public readonly message: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  withLog<T>(obs: Observable<T>) {
    const _obs = new Subject();
    const _fn = (e: any) => {
      _obs.next(e);
    };
    const _removeListener = () => events.removeListener('logs', _fn);

    events.addListener('logs', _fn);

    obs.pipe(take(1)).subscribe({
      next: (res) => {
        _obs.next(res);
        _obs.complete();
        _removeListener();
      },
      error: (err) => {
        _obs.error(err);
        _removeListener();
      },
    });

    return _obs.asObservable();
  }
}
