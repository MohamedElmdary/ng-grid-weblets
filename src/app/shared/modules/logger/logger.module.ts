import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerComponent } from './logger.component';

import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [LoggerComponent],
  imports: [CommonModule, MatCardModule],
  exports: [LoggerComponent],
})
export class LoggerModule {}
