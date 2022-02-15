import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  @Input() form!: FormGroup;

  hide = true;

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get token(): FormControl {
    return this.form.get('token') as FormControl;
  }

  get ssh(): FormControl {
    return this.form.get('ssh') as FormControl;
  }
}
