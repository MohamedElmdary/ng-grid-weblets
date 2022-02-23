import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileManagerComponent } from './profile-manager.component';
import { createCustomElement } from '@angular/elements';
import { ProfileManagerDialogComponent } from './profile-manager-dialog/profile-manager-dialog.component';
import { ProfileManagerState } from '@app/store/profile-manager/profile-manager.store';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule } from '@ngxs/store';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileComponent } from './profile/profile.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    ProfileManagerComponent,
    ProfileManagerDialogComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([ProfileManagerState]),
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  entryComponents: [ProfileManagerComponent],
})
export class ProfileManagerModule {
  constructor(readonly injector: Injector) {
    const el = createCustomElement(ProfileManagerComponent, { injector });
    customElements.define('tf-profile-manager', el);
  }
}
