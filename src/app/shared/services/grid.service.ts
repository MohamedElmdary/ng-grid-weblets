import { Injectable } from '@angular/core';
import { GridClient, NetworkEnv, BackendStorageType } from 'grid3_client';
import { HTTPMessageBusClient } from 'ts-rmb-http-client';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';

interface IUrsl {
  graphql: string;
  rmbProxy: string;
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
  private __grid$ = new BehaviorSubject<GridClient | null>(null);
  public grid$ = this.__grid$.asObservable();

  get grid(): Observable<GridClient> {
    const grid = new GridClient(
      NetworkEnv.dev,
      'guilt leaf sure wheel shield broom retreat zone stove cycle candy nation',
      'secret',
      new HTTPMessageBusClient(0, '', '', ''),
      undefined,
      BackendStorageType.tfkvstore
    );

    return from(grid.connect()).pipe(map(() => grid));
  }

  get urls(): Observable<IUrsl> {
    return this.grid.pipe(
      map((grid) => grid.getDefaultUrls(NetworkEnv.dev) as unknown as IUrsl)
    );
  }

  public __createNewGrid({ mnemonic }: IProfile, storeSecret: string) {
    const grid = new GridClient(
      NetworkEnv.dev,
      mnemonic,
      storeSecret,
      new HTTPMessageBusClient(0, '', '', ''),
      undefined,
      BackendStorageType.tfkvstore
    );

    return from(grid.connect()).pipe(
      tap(() => {
        this.__grid$.next(grid);
      }),
      map(() => grid)
    );
  }
}
