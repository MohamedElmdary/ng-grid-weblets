import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfVmComponent } from './tf-vm.component';

describe('TfVmComponent', () => {
  let component: TfVmComponent;
  let fixture: ComponentFixture<TfVmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfVmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TfVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
