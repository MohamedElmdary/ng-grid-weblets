import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GridService } from '@app/shared/services/grid.service';
import { ActiveProfile } from '@app/store/profile-manager/profile-manager.actions';
import { IProfile } from '@app/store/profile-manager/profile-manager.types';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() profile!: IProfile;
  @Input() index!: number;

  loading = false;
  form!: FormGroup;

  get mnemonic(): FormControl {
    return this.form.get('mnemonic') as FormControl;
  }

  get sshKey(): FormControl {
    return this.form.get('sshKey') as FormControl;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const { mnemonic, sshKey } = this.profile;

    this.form = this.fb.group({
      mnemonic: [mnemonic, [Validators.required]],
      sshKey: [sshKey, [Validators.required]],
    });
  }

  active() {
    this.loading = true;
    this.store
      .dispatch(new ActiveProfile(this.index, this.form.value))
      .subscribe({
        error: (error) => {
          console.log({ error });
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
