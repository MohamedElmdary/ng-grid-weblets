import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-k8s',
  templateUrl: './k8s.component.html',
  styleUrls: ['./k8s.component.scss'],
})
export class K8sComponent {
  k8sForm = this.fb.group({
    base: this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      token: ['', Validators.required],
      ssh: ['', Validators.required],
    }),

    network: this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      ipRange: ['', [Validators.required]],
    }),

    master: this.__createWorker(),

    workers: this.fb.array([]),
  });

  get base(): FormGroup {
    return this.k8sForm.get('base') as FormGroup;
  }

  get network(): FormGroup {
    return this.k8sForm.get('network') as FormGroup;
  }

  get master(): FormGroup {
    return this.k8sForm.get('master') as FormGroup;
  }

  get workers(): FormArray {
    return this.k8sForm.get('workers') as FormArray;
  }

  constructor(private readonly fb: FormBuilder) {
    if (!environment.production) {
      const debug = new Date().getTime().toString().slice(0, 5);
      this.k8sForm.setValue({
        base: {
          name: 'K8S' + debug,
          token: '123456',
          ssh: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMUv2EQUnLL/Ei2+JRR/8EFIOrMxmlVLIc7psOZau6FE engm5081@gmail.com',
        },
        network: {
          name: 'NW' + debug,
          ipRange: '10.20.0.0/16',
        },
        master: {
          name: 'M' + debug,
          cpu: 2,
          memory: 4 * 1024,
          disk: 50,
          ipv4: false,
          ipv6: false,
          planetary: true,
          rootFs: 2,
          nodeId: 8,
        },
        workers: [],
      });
    }
  }

  private __createWorker(): FormGroup {
    return this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
        ],
      ],
      cpu: [2, Validators.required],
      memory: [4 * 1024, Validators.required],
      disk: [100, [Validators.required, Validators.min(1)]],
      ipv4: [false],
      ipv6: [false],
      planetary: [true],
      rootFs: [2, [Validators.required, Validators.min(0.5)]],
      nodeId: [null, Validators.required],
    });
  }

  addWorker() {
    this.workers.push(this.__createWorker());
  }

  public deployK8s(): void {
    console.log(this.k8sForm.value);
  }
}
