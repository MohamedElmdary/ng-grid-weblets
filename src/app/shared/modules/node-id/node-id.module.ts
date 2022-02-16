import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeIdComponent } from './node-id.component';
import { ReactiveFormsModule } from '@angular/forms';

/* Material Components */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [NodeIdComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [NodeIdComponent],
})
export class NodeIdModule {}
