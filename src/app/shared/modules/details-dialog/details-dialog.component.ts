import { Component, Inject } from '@angular/core';
import { K8SModel, MachineModel, KubernetesNodeModel } from 'grid3_client';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IData {
  title: string;
  type: 'k8s' | 'vm';
  data: K8SModel | MachineModel;
}

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss'],
})
export class DetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: IData,
    private readonly snackBar: MatSnackBar
  ) {}

  get title(): string {
    return this.data.title;
  }

  get info(): IData['data'] {
    return this.data.data;
  }

  get jsonInfo(): string {
    return JSON.stringify(this.info, undefined, 4);
  }

  get type(): IData['type'] {
    return this.data.type;
  }

  get master(): any {
    const [master] = (this.info as K8SModel).masters;
    return master;
  }

  get workers(): KubernetesNodeModel[] {
    const { workers = [] } = this.info as K8SModel;
    return workers;
  }

  copy(): void {
    const input = document.createElement('textarea');
    input.value = this.jsonInfo;
    input.style.display = 'block';
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    input.remove();
    this.snackBar.open('Data was copied', 'OK', { duration: 3000 });
  }
}
