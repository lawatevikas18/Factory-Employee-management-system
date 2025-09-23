import { TestBed } from '@angular/core/testing';

import { EmployeeAdvanceService } from './employee-advance.service';

describe('EmployeeAdvanceService', () => {
  let service: EmployeeAdvanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAdvanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
