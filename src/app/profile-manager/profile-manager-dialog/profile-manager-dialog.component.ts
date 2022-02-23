import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfileManagerState } from '@app/store/profile-manager/profile-manager.store';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddNewProfile,
  CreateNewProfileManager,
  RemoveProfile,
} from '@app/store/profile-manager/profile-manager.actions';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-manager-dialog',
  templateUrl: './profile-manager-dialog.component.html',
  styleUrls: ['./profile-manager-dialog.component.scss'],
})
export class ProfileManagerDialogComponent {
  @Select(ProfileManagerState.active) active$!: Observable<boolean>;
  @Select(ProfileManagerState.profile) profile$!: Observable<IProfile>;
  @Select(ProfileManagerState.profiles) profiles$!: Observable<IProfile[]>;

  hide = false;
  form = this.fb.group({
    password: ['secret', [Validators.required]],
  });

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<ProfileManagerDialogComponent>
  ) {}

  loadProfiles(): void {
    console.log('load profile');
  }

  createNewProfile(): void {
    this.store.dispatch(new CreateNewProfileManager(this.password.value));
  }

  addProfile() {
    this.store.dispatch(new AddNewProfile());
  }

  save() {}

  deactivate() {}

  removeProfile(e: Event, i: number) {
    e.stopPropagation();
    this.store.dispatch(new RemoveProfile(i));
  }
}
