import { Component, Input, OnInit } from '@angular/core';
import { LogService } from '@app/shared/services/log.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss'],
})
export class LoggerComponent implements OnInit {
  @Input() deployer!: Observable<unknown>;

  deployer$!: Observable<unknown>;

  constructor(private readonly logger: LogService) {}

  ngOnInit(): void {
    this.deployer$ = this.logger.withLog(this.deployer);
  }
}
