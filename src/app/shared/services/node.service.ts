import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { FilterOptions, Nodes, NodeInfo } from 'grid3_client';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private readonly gridService: GridService) {}

  findNodes(filters: FilterOptions) {
    return this.gridService.urls.pipe(
      map(({ graphql, rmbProxy }) => new Nodes(graphql, rmbProxy)),
      mergeMap((nodesCtrl) =>
        nodesCtrl.filterNodes(filters).catch<NodeInfo[]>(() => [])
      )
    );
  }

  validateNodeId(filters: FilterOptions, id: number): Observable<boolean> {
    return this.findNodes(filters).pipe(
      map((nodes) => nodes.findIndex(({ nodeId }) => nodeId === id) > -1)
    );
  }
}
