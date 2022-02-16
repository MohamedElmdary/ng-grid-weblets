import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GridService } from '../shared/services/grid.service';
import { ValidatorsService } from '../shared/services/validators.service';
import {
  K8SModel,
  FilterOptions,
  KubernetesNodeModel,
  NetworkModel,
} from 'grid3_client';
@Component({
  selector: 'app-k8s',
  templateUrl: './k8s.component.html',
  styleUrls: ['./k8s.component.scss'],
})
export class K8sComponent {
  deploying = false;

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

    workers: this.fb.array([this.__createWorker()]),
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly gridService: GridService,
    private readonly validatorsService: ValidatorsService
  ) {
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
          ipv4: true,
          ipv6: false,
          planetary: true,
          rootFs: 2,
          nodeId: null,
        },
        workers: [
          {
            name: 'W' + debug,
            cpu: 2,
            memory: 4 * 1024,
            disk: 50,
            ipv4: false,
            ipv6: false,
            planetary: true,
            rootFs: 2,
            nodeId: 5,
          },
        ],
      });

      // this.k8sForm.markAllAsTouched();
    }
  }

  private __createWorker(): FormGroup {
    const group: FormGroup = this.fb.group({
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
      nodeId: [
        null,
        [Validators.required],
        [
          (ctrl: FormControl) => {
            const filters: FilterOptions = {
              cru: (group.get('cpu') as FormControl).value,
              mru: (group.get('memory') as FormControl).value / 1024,
              sru: (group.get('disk') as FormControl).value,
              publicIPs: (group.get('ipv4') as FormControl).value,
            };
            return this.validatorsService.validatetNodeId(ctrl, filters);
          },
        ],
      ],
    });

    return group;
  }

  addWorker() {
    this.workers.push(this.__createWorker());
  }

  private __createNode(data: any) {
    const node = new KubernetesNodeModel();
    node.name = data.name;
    node.node_id = data.nodeId;
    node.cpu = data.cpu;
    node.disk_size = data.disk;
    node.memory = data.memory;
    node.public_ip = data.ipv4;
    node.public_ip6 = data.ipv6;
    node.rootfs_size = data.rootFs;
    node.planetary = data.planetary;
    return node;
  }

  private get __network() {
    const { name, ipRange } = this.network.value;

    const network = new NetworkModel();
    network.name = name;
    network.ip_range = ipRange;
    return network;
  }

  public async deployK8s(): Promise<void> {
    this.deploying = true;

    // prettier-ignore

    const masterNodes = [this.__createNode(this.master.value)];
    const workerNodes = this.workers.value.map(this.__createNode.bind(this));

    const { name, token, ssh } = this.base.value;
    const k8s = new K8SModel();
    k8s.name = name;
    k8s.secret = token;
    k8s.network = this.__network;
    k8s.masters = masterNodes;
    k8s.workers = workerNodes;
    k8s.metadata = '';
    k8s.description = '';
    k8s.ssh_key = ssh;

    this.gridService.grid
      .pipe(
        mergeMap((grid) => {
          return from(grid.k8s.deploy(k8s)).pipe(
            mergeMap(() => {
              return grid.k8s.getObj(name);
            })
          );
        })
      )
      .subscribe({
        next: console.log,
        error: console.log,
        complete: () => (this.deploying = false),
      });
  }
}
