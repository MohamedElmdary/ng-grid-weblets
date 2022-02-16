import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { debounceTime, tap, switchMap, startWith } from 'rxjs/operators';
import { NodeInfo, FilterOptions } from 'grid3_client';
import { NodeService } from '../../services/node.service';
import { byCountry } from 'country-code-lookup';

@Component({
  selector: 'app-node-id-selector',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Node ID</mat-label>
      <mat-select [formControl]="nodeId">
        <mat-option *ngFor="let node of nodes" [value]="node.nodeId">
          <div [ngStyle]="{ display: 'flex', alignItems: 'center' }">
            <img
              [src]="getCountryFlag(node.location.country)"
              [ngStyle]="{ marginRight: '10px' }"
              height="20"
            />
            <span>
              {{ node.location.country }} | Node ID({{ node.nodeId }})
            </span>
          </div>
        </mat-option>
      </mat-select>

      <mat-progress-spinner
        *ngIf="pending"
        matSuffix
        [diameter]="20"
        mode="indeterminate"
      ></mat-progress-spinner>

      <mat-hint *ngIf="pending">
        Fetching nodes with the required resources.
      </mat-hint>

      <mat-hint *ngIf="!pending && nodes.length === 0">
        No nodes with the required resources.
      </mat-hint>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class NodeIdComponent implements OnInit, OnDestroy {
  @Input() nodeId!: FormControl;
  @Input() watch!: AbstractControl[];
  @Input() filters!: FilterOptions;

  pending = false;
  nodes: NodeInfo[] = [];
  private __listNodeId$!: Subscription;

  constructor(private readonly nodeService: NodeService) {}

  ngOnInit(): void {
    let _node: number;

    this.__listNodeId$ = merge(...this.watch.map((w) => w.valueChanges))
      .pipe(
        startWith(null),
        tap(() => {
          if (this.nodeId.value !== null) {
            this.nodes = [];
            _node = this.nodeId.value;
            this.nodeId.setValue(null);
          }
          this.pending = true;
        }),
        debounceTime(1000),
        switchMap(() => this.nodeService.findNodes(this.filters)),
        tap((nodes) => {
          this.pending = false;
          this.nodes = nodes;
          if (nodes.findIndex((n) => n.nodeId === _node) > -1) {
            this.nodeId.setValue(_node);
            this.nodeId.updateValueAndValidity();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.__listNodeId$.unsubscribe();
  }

  getCountryFlag(country: string): string {
    const code = byCountry(country)?.iso2.toLocaleLowerCase() ?? '';
    return `https://www.worldatlas.com/r/w425/img/flag/${code}-flag.jpg`;
  }
}
