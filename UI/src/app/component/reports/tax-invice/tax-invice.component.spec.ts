import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInviceComponent } from './tax-invice.component';

describe('TaxInviceComponent', () => {
  let component: TaxInviceComponent;
  let fixture: ComponentFixture<TaxInviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
