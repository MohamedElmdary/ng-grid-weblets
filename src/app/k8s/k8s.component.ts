import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { environment } from '../../environments/environment';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GridService } from '../shared/services/grid.service';
import { K8SModel, KubernetesNodeModel, NetworkModel } from 'grid3_client';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../shared/modules/details-dialog/details-dialog.component';

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
    private readonly dialog: MatDialog
  ) {}

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
      nodeId: [null, [Validators.required]],
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
              return grid.k8s.getObj(name) as Promise<K8SModel>;
            })
          );
        })
      )
      .subscribe({
        next: (data) => {
          this.dialog.open(DetailsDialogComponent, {
            data: { title: 'Kubernetes Cluster Details', type: 'k8s', data },
          });
        },
        error: console.log,
        complete: () => (this.deploying = false),
      });
  }
}
