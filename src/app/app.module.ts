import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TfVmComponent } from './tf-vm/tf-vm.component';
import { K8sModule } from './k8s/k8s.module';
import { DeploymentListModule } from './deployment-list/deployment-list.module';

import { ProfileManagerModule } from '@app/profile-manager/profile-manager.module';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [AppComponent, TfVmComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule,
    K8sModule,
    DeploymentListModule,
    ProfileManagerModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [TfVmComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    const el = createCustomElement(TfVmComponent, { injector });
    customElements.define('tf-vm', el);
  }
}
