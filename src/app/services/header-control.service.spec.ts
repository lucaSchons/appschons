import { TestBed } from '@angular/core/testing';

import { HeaderControlService } from './header-control.service';

describe('HeaderControlService', () => {
  let service: HeaderControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
