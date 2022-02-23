import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span [ngStyle]="{ flexGrow: 1 }"></span>
      <tf-profile-manager></tf-profile-manager>
    </mat-toolbar>

    <main>
      <tf-k8s></tf-k8s>
      <tf-list></tf-list>
    </main>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
