import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileManagerState } from '@app/store/profile-manager/profile-manager.store';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileManagerDialogComponent } from './profile-manager-dialog/profile-manager-dialog.component';
import md5 from 'crypto-js/md5';
import { LoadProfileManager } from '@app/store/profile-manager/profile-manager.actions';
import { IAppState } from '@app/store';

@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss'],
})
export class ProfileManagerComponent implements OnInit {
  @Select(ProfileManagerState.balance) balance$!: Observable<number>;
  @Select(ProfileManagerState.profile) profile$!: Observable<IProfile>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const password = sessionStorage.getItem('password');
    if (!password) return this.open();

    const hash = md5(password);
    this.store
      .dispatch(new LoadProfileManager(password, hash))
      .subscribe((s: IAppState) => {
        if (s.ProfileManager.activeProfile === -1) this.open();
      });
  }

  open() {
    this.dialog.open(ProfileManagerDialogComponent, {
      disableClose: true,
    });
  }
}
