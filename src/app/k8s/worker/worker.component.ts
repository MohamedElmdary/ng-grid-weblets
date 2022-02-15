import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.scss'],
})
export class WorkerComponent {
  @Input() form!: FormGroup;
  @Input() removable: boolean = false;

  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get cpu(): FormControl {
    return this.form.get('cpu') as FormControl;
  }

  get memory(): FormControl {
    return this.form.get('memory') as FormControl;
  }

  get disk(): FormControl {
    return this.form.get('disk') as FormControl;
  }

  get rootFs(): FormControl {
    return this.form.get('rootFs') as FormControl;
  }

  get nodeId(): FormControl {
    return this.form.get('nodeId') as FormControl;
  }
}
