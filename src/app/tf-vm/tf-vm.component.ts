import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-tf-vm',
  templateUrl: './tf-vm.component.html',
  styleUrls: ['./tf-vm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TfVmComponent {
  loading = false;

  vmForm = this.fb.group({
    name: [
      'RabieVMDemo',
      [Validators.required, Validators.minLength(2), Validators.maxLength(15)],
    ],
    flist: [
      'https://hub.grid.tf/tf-official-apps/threefoldtech-ubuntu-20.04.flist',
      [Validators.required],
    ],
    entryPoint: ['/init.sh', [Validators.required]],
    rootFs: [2, [Validators.required]],
    cpu: [4, [Validators.required]],
    memory: [8 * 1024, [Validators.required]],
    ipv4: [false],
    ipv6: [false],
    planetary: [true],
    nodeId: [
      8,
      [Validators.required],
      [
        /* async validator */
        // (...args: any[]) => {
        //   console.log(args);
        //   return of(null);
        // },
      ],
    ],

    envs: this.fb.array([]),

    disks: this.fb.array([]),

    mnemonics: [
      'guilt leaf sure wheel shield broom retreat zone stove cycle candy nation',
      [Validators.required],
    ],
    sshKey: [
      'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMUv2EQUnLL/Ei2+JRR/8EFIOrMxmlVLIc7psOZau6FE engm5081@gmail.com',
      [Validators.required],
    ],
  });

  get name(): FormControl { return this.vmForm.get('name') as FormControl; } // prettier-ignore
  get flist(): FormControl { return this.vmForm.get('flist') as FormControl; } // prettier-ignore
  get entryPoint(): FormControl { return this.vmForm.get('entryPoint') as FormControl; } // prettier-ignore
  get rootFs(): FormControl { return this.vmForm.get('rootFs') as FormControl; } // prettier-ignore
  get cpu(): FormControl { return this.vmForm.get('cpu') as FormControl; } // prettier-ignore
  get memory(): FormControl { return this.vmForm.get('memory') as FormControl; } // prettier-ignore
  get ipv4(): FormControl { return this.vmForm.get('ipv4') as FormControl; } // prettier-ignore
  get ipv6(): FormControl { return this.vmForm.get('ipv6') as FormControl; } // prettier-ignore
  get planetary(): FormControl { return this.vmForm.get('planetary') as FormControl; } // prettier-ignore
  get nodeId(): FormControl { return this.vmForm.get('nodeId') as FormControl; } // prettier-ignore
  get envs(): FormArray { return this.vmForm.get('envs') as FormArray; } // prettier-ignore
  get envsCtrl(): FormGroup[] { return this.envs.controls as FormGroup[]; } // prettier-ignore
  get disks(): FormArray { return this.vmForm.get('disks') as FormArray; } // prettier-ignore
  get disksCtrl(): FormGroup[] { return this.disks.controls as FormGroup[]; } // prettier-ignore
  get mnemonics(): FormControl { return this.vmForm.get('mnemonics') as FormControl; } // prettier-ignore

  public addEnv() {
    this.envs.push(
      this.fb.group({
        key: ['', [Validators.required]],
        value: ['', [Validators.required]],
      })
    );
  }

  public removeEnv(idx: number) {
    this.envs.removeAt(idx);
  }

  public addDisk() {
    this.disks.push(
      this.fb.group({
        name: ['', [Validators.required]],
        size: [50, [Validators.required]],
        mountPoint: ['', [Validators.required]],
      })
    );
  }

  public removeDisk(idx: number) {
    this.disks.removeAt(idx);
  }

  constructor(private fb: FormBuilder) {}

  private get __disks() {
    const { DiskModel } = window.configs.grid3_client;
    return this.disks.value.map(({ name, size, mountPoint }: any) => {
      const disk = new DiskModel();
      disk.name = name;
      disk.size = size;
      disk.mountpoint = mountPoint;
      return disk;
    });
  }

  private get __envs() {
    return this.envs.value.reduce((res: any, env: any) => {
      res[env.key] = env.value;
      return res;
    }, {});
  }

  private get __network() {
    const { NetworkModel } = window.configs.grid3_client;
    const nw = new NetworkModel();
    nw.name = 'RabieNW';
    nw.ip_range = '10.20.0.0/16';
    nw.addAccess = false;
    return nw;
  }

  async deploy() {
    const { HTTPMessageBusClient } = window.configs.ts_rmb_http_client;
    const {
      MachineModel,
      MachinesModel,
      GridClient,
      NetworkEnv,
      BackendStorageType,
    } = window.configs.grid3_client;

    const vm = new MachineModel();
    vm.name = this.name.value;
    vm.node_id = this.nodeId.value;
    vm.public_ip = this.ipv4.value;
    vm.public_ip6 = this.ipv6.value;
    vm.planetary = this.planetary.value;
    vm.cpu = this.cpu.value;
    vm.memory = this.memory.value;
    vm.rootfs_size = this.rootFs.value;
    vm.flist = this.flist.value;
    vm.entrypoint = this.entryPoint.value;
    vm.disks = this.__disks;
    vm.env = this.__envs;

    const vms = new MachinesModel();
    vms.name = this.name.value;
    vms.network = this.__network;
    vms.machines = [vm];

    const grid = new GridClient(
      NetworkEnv.dev,
      this.mnemonics.value,
      'secret',
      new HTTPMessageBusClient(0, '', '', ''),
      undefined,
      BackendStorageType.tfkvstore
    );

    await grid.connect();

    await grid.machines.deploy(vms);
    const vmObj = await grid.machines.getObj(this.name.value);
    console.log({ Details: vmObj });
  }
}
