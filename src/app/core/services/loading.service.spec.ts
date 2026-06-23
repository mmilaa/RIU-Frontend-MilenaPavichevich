import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(service.loading()).toBeFalse();
  });

  it('should set loading to true', () => {
    service.show();
    expect(service.loading()).toBeTrue();
  })

  it('should set loading to false', () => {
    service.show();
    service.hide();
    expect(service.loading()).toBeFalse();
  })

});
