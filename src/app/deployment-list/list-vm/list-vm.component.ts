import { Component, OnInit } from '@angular/core';
import { ListService } from '../../shared/services/list.service';

@Component({
  selector: 'app-list-vm',
  templateUrl: './list-vm.component.html',
  styleUrls: ['./list-vm.component.scss'],
})
export class ListVmComponent implements OnInit {
  constructor(public readonly listService: ListService) {}

  ngOnInit(): void {
    this.listService.virtualMachines.subscribe(console.log);
  }
}
