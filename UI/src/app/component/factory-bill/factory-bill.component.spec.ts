import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryBillComponent } from './factory-bill.component';

describe('FactoryBillComponent', () => {
  let component: FactoryBillComponent;
  let fixture: ComponentFixture<FactoryBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
