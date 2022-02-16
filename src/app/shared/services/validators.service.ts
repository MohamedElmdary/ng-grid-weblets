import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  first,
} from 'rxjs/operators';
import { NodeService } from './node.service';
import { FilterOptions } from 'grid3_client';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  constructor(private readonly nodeService: NodeService) {}

  // validatetNodeId(ctrl: FormControl, filters: FilterOptions) {
  //   return ctrl.valueChanges.pipe(
  //     debounceTime(1000),
  //     distinctUntilChanged(),
  //     switchMap(() => {
  //       return this.nodeService.validateNodeId(filters, ctrl.value);
  //     }),
  //     map((res) => (res ? null : { invalidNodeId: true })),
  //     first()
  //   );
  // }
}
