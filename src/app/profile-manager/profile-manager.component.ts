import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileManagerDialogComponent } from './profile-manager-dialog/profile-manager-dialog.component';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss'],
})
export class ProfileManagerComponent {
  constructor(readonly dialog: MatDialog) {
    dialog.open(ProfileManagerDialogComponent, {
      disableClose: true,
    });
  }
}
