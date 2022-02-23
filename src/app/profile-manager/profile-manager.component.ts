import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileManagerState } from '@app/store/profile-manager/profile-manager.store';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileManagerDialogComponent } from './profile-manager-dialog/profile-manager-dialog.component';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss'],
})
export class ProfileManagerComponent implements OnInit {
  @Select(ProfileManagerState.balance) balance$!: Observable<number>;
  @Select(ProfileManagerState.profile) profile$!: Observable<IProfile>;

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.open();
  }

  open() {
    this.dialog.open(ProfileManagerDialogComponent, {
      disableClose: true,
    });
  }
}
