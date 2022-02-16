import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { merge, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'app-node-id-selector',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Node ID</mat-label>
      <input
        matInput
        type="number"
        placeholder="Node ID"
        autocomplete="off"
        [formControl]="nodeId"
      />

      <mat-progress-spinner
        *ngIf="nodeId.status === 'PENDING'"
        matSuffix
        [diameter]="20"
        mode="indeterminate"
      ></mat-progress-spinner>

      <mat-hint *ngIf="nodeId.status === 'VALID'">
        Node ID({{ nodeId.value }}) is valid.
      </mat-hint>

      <mat-hint *ngIf="nodeId.status === 'PENDING'">
        Node ID({{ nodeId.value }}) is being validated ...
      </mat-hint>

      <mat-error *ngIf="nodeId.errors">
        <span *ngIf="nodeId.errors['required']">Node ID is required.</span>
        <span *ngIf="nodeId.errors['invalidNodeId']">
          Node ID is not valid.
        </span>
        <span *ngIf="nodeId.errors['validating']">
          Node ID needs to be revalidated.
        </span>
      </mat-error>
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
  @Input() watch: AbstractControl[] = [];

  private __subscription$!: Subscription;

  ngOnInit(): void {
    this.__subscription$ = merge(...this.watch.map((w) => w.valueChanges))
      .pipe(
        tap(() => this.nodeId.setErrors({ validating: true })),
        debounceTime(1000)
      )
      .subscribe(() => this.nodeId.updateValueAndValidity());
  }

  ngOnDestroy(): void {
    this.__subscription$.unsubscribe();
  }
}
