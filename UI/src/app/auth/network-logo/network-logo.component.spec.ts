import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkLogoComponent } from './network-logo.component';

describe('NetworkLogoComponent', () => {
  let component: NetworkLogoComponent;
  let fixture: ComponentFixture<NetworkLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
