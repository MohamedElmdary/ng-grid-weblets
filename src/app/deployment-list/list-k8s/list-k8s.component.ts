import { Component } from '@angular/core';
import { ListService } from '../../shared/services/list.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../../shared/modules/details-dialog/details-dialog.component';
import { map } from 'rxjs/operators';

interface IK8S {
  masters: any[];
  workers: any[];
}

@Component({
  selector: 'app-list-k8s',
  templateUrl: './list-k8s.component.html',
  styleUrls: ['./list-k8s.component.scss'],
})
export class ListK8sComponent {
  loading = false;
  cols: string[] = [
    'position',
    'name',
    'ipv4',
    'ipv6',
    'planetary',
    'workers',
    'billingRate',
    'actions',
  ];
  dataSource: any[] = [];

  constructor(
    public readonly listService: ListService,
    private readonly dialog: MatDialog
  ) {}

  private static __formatK8sObj(data: IK8S) {
    const [master] = data.masters;
    return {
      name: master.name,
      ipv4: master.publicIP?.ip || 'None',
      ipv6: master.publicIP?.ip6 || 'None',
      planetary: master.planetary || 'None',
      workers: data.workers.length,
      billingRate: 'Up Coming...',
      data,
    };
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.listService.kubernetes
      .pipe(map((results) => results.map(ListK8sComponent.__formatK8sObj)))
      .subscribe({
        next: (res) => {
          this.dataSource = res;
        },
        complete: () => (this.loading = false),
      });
  }

  showDetails({ data }: { data: IK8S }) {
    this.dialog.open(DetailsDialogComponent, {
      data: { title: 'Kubernetes Cluster Details', type: 'k8s', data },
    });
  }
}
