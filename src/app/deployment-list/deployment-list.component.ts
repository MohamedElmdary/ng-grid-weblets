import { Component } from '@angular/core';

@Component({
  selector: 'app-deployment-list',
  templateUrl: './deployment-list.component.html',
  styles: [
    `
      .k8s {
        padding: 15px;

        &__title {
          margin-bottom: 25px;
        }
      }

      .to-end {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class DeploymentListComponent {}
