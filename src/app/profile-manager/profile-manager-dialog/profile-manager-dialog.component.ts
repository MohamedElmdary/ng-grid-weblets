import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProfileManagerState } from '@app/store/profile-manager/profile-manager.store';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  AddNewProfile,
  CreateNewProfileManager,
  RemoveProfile,
  DeactivateProfile,
  UnActivateProfileManager,
  LoadProfileManager,
} from '@app/store/profile-manager/profile-manager.actions';
import { IAppState } from '@app/store';
import { MatSnackBar } from '@angular/material/snack-bar';

import md5 from 'crypto-js/md5';
import { encrypt } from 'crypto-js/aes';

@Component({
  selector: 'app-profile-manager-dialog',
  templateUrl: './profile-manager-dialog.component.html',
  styleUrls: ['./profile-manager-dialog.component.scss'],
})
export class ProfileManagerDialogComponent implements OnInit {
  @Select(ProfileManagerState.active) active$!: Observable<boolean>;
  @Select(ProfileManagerState.profile) profile$!: Observable<IProfile>;
  @Select(ProfileManagerState.profiles) profiles$!: Observable<IProfile[]>;

  hide = true;
  form!: FormGroup;

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const password = this.store.selectSnapshot((s: IAppState) => {
      return s.ProfileManager.password || '';
    });

    this.form = this.fb.group({
      password: [password, [Validators.required]],
    });
  }

  loadProfiles(): void {
    const passwordHash = md5(this.password.value).toString();
    if (!localStorage.getItem(passwordHash)) {
      this.password.setErrors({ notfound: true });
      return this.password.markAllAsTouched();
    }

    this.store
      .dispatch(new LoadProfileManager(this.password.value, passwordHash))
      .subscribe(() => this.__storePassword(this.password.value));
  }

  createNewProfile(): void {
    const passwordHash = md5(this.password.value).toString();
    if (localStorage.getItem(passwordHash)) {
      this.password.setErrors({ found: true });
      return this.password.markAllAsTouched();
    }

    this.store
      .dispatch(new CreateNewProfileManager(this.password.value))
      .subscribe(() => {
        this.save();
        this.__storePassword(this.password.value);
      });
  }

  addProfile() {
    this.store.dispatch(new AddNewProfile());
  }

  save() {
    const { data, password } = this.store.selectSnapshot((s: IAppState) => {
      return {
        password: s.ProfileManager.password,
        data: JSON.stringify({
          profiles: s.ProfileManager.profiles,
          activeProfile: s.ProfileManager.activeProfile,
        }),
      };
    });

    const passwordHash = md5(password).toString();
    const dataHash = encrypt(data, password).toString();
    localStorage.setItem(passwordHash, dataHash);

    this.snackBar.open('Profile Manager Data is stored', 'ok', {
      duration: 3000,
    });
  }

  unactivate() {
    this.store.dispatch(new UnActivateProfileManager()).subscribe(() => {
      this.save();
      this.__removePassword();
    });
  }

  deactivate() {
    this.__removePassword();
    this.store.dispatch(new DeactivateProfile()).subscribe(() => {
      this.save();
      this.__removePassword();
    });
  }

  removeProfile(e: Event, i: number) {
    e.stopPropagation();
    this.store.dispatch(new RemoveProfile(i));
  }

  private __storePassword(password: string): void {
    sessionStorage.setItem('password', password);
  }

  private __removePassword(): void {
    sessionStorage.removeItem('password');
  }
}
