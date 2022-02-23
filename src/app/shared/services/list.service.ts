import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { from, of, EMPTY, forkJoin, Observable } from 'rxjs';
import {
  mergeMap,
  filter,
  catchError,
  tap,
  toArray,
  map,
} from 'rxjs/operators';
import { GridClient } from 'grid3_client';

interface IOptions {
  type?: 'k8s' | 'machines';
  filter(obj: any): boolean;
  projectName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  get kubernetes() {
    return this.__list({
      type: 'k8s',
      filter: ({ masters: [m] }) => !!m,
    });
  }

  get virtualMachines() {
    return this.__list({
      type: 'machines',
      filter: (x) => !!x.length,
    });
  }

  constructor(private readonly gridService: GridService) {}

  private __list(options?: Partial<IOptions>) {
    options = options || {};
    const type = options.type || 'machines';
    const _filter = options.filter || (() => true);

    let grid: GridClient;

    // prettier-ignore
    return this.gridService.getGrid().pipe(
      tap((g) => (grid = g)),
      mergeMap(() => from(grid[type].list())),
      mergeMap((names) => of(...names)),
      map((name) => from(grid[type].getObj(name)).pipe(catchError(() => EMPTY))),
      toArray(),
      mergeMap((items) => forkJoin(items)),
      mergeMap((items) => of(...items)),
      filter((x) => !!x),
      filter(_filter),
      toArray()
    ) as Observable<any[]>;
  }
}
