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

    events.addListener('logs', (e) => {
      _obs.next(e);
    });

    obs.pipe(take(1)).subscribe({
      next: (res) => {
        _obs.next(res);
        _obs.complete();
      },
      error: (err) => {
        _obs.error(err);
      },
    });

    return _obs.asObservable();
    // events.addListener('log', (e) => {
    //   console.log(e);
    // });

    // return obs.pipe(
    //   tap(() => console.log('done')),
    //   catchError((error) => {
    //     console.log('Error');
    //     return error;
    //   })
    // ) as any;
  }
}
