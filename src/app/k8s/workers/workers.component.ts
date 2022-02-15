import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss'],
})
export class WorkersComponent {
  @Input() form!: FormArray;

  get workers(): FormGroup[] {
    return this.form.controls as FormGroup[];
  }
}
