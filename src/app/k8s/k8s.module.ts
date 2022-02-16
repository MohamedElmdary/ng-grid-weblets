/* Angular Libs */
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';
import { ReactiveFormsModule } from '@angular/forms';

/* Material Components */
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/* Components */
import { K8sComponent } from './k8s.component';
import { BaseComponent } from './base/base.component';
import { NetworkComponent } from './network/network.component';
import { WorkerComponent } from './worker/worker.component';
import { WorkersComponent } from './workers/workers.component';
import { NodeIdModule } from '../shared/modules/node-id/node-id.module';

@NgModule({
  declarations: [
    K8sComponent,
    BaseComponent,
    NetworkComponent,
    WorkerComponent,
    WorkersComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    NodeIdModule,
  ],
  entryComponents: [K8sComponent],
})
export class K8sModule {
  constructor(readonly injector: Injector) {
    const k8s = createCustomElement(K8sComponent, { injector });
    customElements.define('tf-k8s', k8s);
  }
}
