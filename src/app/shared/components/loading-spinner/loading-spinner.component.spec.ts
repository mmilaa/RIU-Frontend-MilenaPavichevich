import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinnerComponent } from './loading-spinner.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();
    loadingService = TestBed.inject(LoadingService);
    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show spinner when loading is false', () => {
    const overlay = fixture.nativeElement.querySelector('.overlay');

    expect(overlay).toBeNull();
  });

  it('should show spinner when loading is true', () => {
    loadingService.show();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.overlay');
    expect(overlay).toBeTruthy();
  })


});
