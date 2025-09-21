import { TestBed } from '@angular/core/testing';

import { ErrorPopUpService } from './error-pop-up.service';

describe('ErrorPopUpService', () => {
  let service: ErrorPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
