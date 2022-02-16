import { Injectable } from '@angular/core';
import { GridClient, NetworkEnv, BackendStorageType } from 'grid3_client';
import { HTTPMessageBusClient } from 'ts-rmb-http-client';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IUrsl {
  graphql: string;
  rmbProxy: string;
}

@Injectable({
  providedIn: 'root',
})
export class GridService {
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
}
