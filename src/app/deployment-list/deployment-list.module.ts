/* Angular Libs */
import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createCustomElement } from '@angular/elements';

/* Material Components */
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

/* Components */
import { DeploymentListComponent } from './deployment-list.component';
import { ListK8sComponent } from './list-k8s/list-k8s.component';
import { ListVmComponent } from './list-vm/list-vm.component';

@NgModule({
  declarations: [DeploymentListComponent, ListK8sComponent, ListVmComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [DeploymentListComponent],
})
export class DeploymentListModule {
  constructor(readonly injector: Injector) {
    const list = createCustomElement(DeploymentListComponent, { injector });
    customElements.define('tf-list', list);
  }
}
