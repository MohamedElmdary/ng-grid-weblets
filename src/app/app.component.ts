import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <tf-k8s></tf-k8s> `,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
