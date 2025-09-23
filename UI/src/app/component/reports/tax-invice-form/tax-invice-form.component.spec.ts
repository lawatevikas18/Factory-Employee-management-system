import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInviceFormComponent } from './tax-invice-form.component';

describe('TaxInviceFormComponent', () => {
  let component: TaxInviceFormComponent;
  let fixture: ComponentFixture<TaxInviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxInviceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
