import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent {
  @Input() form!: FormGroup;

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get ipRange(): FormControl {
    return this.form.get('ipRange') as FormControl;
  }
}
