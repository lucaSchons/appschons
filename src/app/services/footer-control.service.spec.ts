import { TestBed } from '@angular/core/testing';

import { FooterControlService } from './footer-control.service';

describe('FooterControlService', () => {
  let service: FooterControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
