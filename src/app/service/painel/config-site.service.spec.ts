import { TestBed } from '@angular/core/testing';

import { ConfigSiteService } from './config-site.service';

describe('ConfigSiteService', () => {
  let service: ConfigSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
