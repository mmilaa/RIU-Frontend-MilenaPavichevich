import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { HeroService } from '../../../../core/services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { SUPER_HEROES } from '../../../../core/data/super-heroes.data';
import { SuperHero } from '../../../../core/models/super-hero.model';
import { provideRouter, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockConfirmDialog: jasmine.SpyObj<MatDialog>;
  let router: Router;

  const mockHeroes: SuperHero[] = SUPER_HEROES;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getAll', 'getById', 'searchByName', 'create', 'update', 'delete']);
    mockHeroService.getAll.and.returnValue(mockHeroes);
    mockHeroService.searchByName.and.callFake((term: string) =>
      mockHeroes.filter(h => h.name.toLowerCase().includes(term.toLowerCase()))
    );
    mockHeroService.getById.and.callFake((id: number) =>
      mockHeroes.find(h => h.id === id)
    );

    mockConfirmDialog = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatDialog, useValue: mockConfirmDialog },
        
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heroes', () => {
    const heroes = component.paginatedHeroes();
    expect(heroes.length).toBeGreaterThan(0);
  })

  it('should display all heroes when search term is empty', () => {
    expect(component.filteredHeroes()).toEqual(mockHeroes);
  });

  it('should update search term and reset page index', () => {
    component.pageIndex.set(3);

    const input = document.createElement('input');
    input.value = 'super';

    const mockEvent = {
      target: input
    } as unknown as Event;

    component.onSearch(mockEvent);

    expect(component.searchTerm()).toBe('super');
    expect(component.pageIndex()).toBe(0);
    expect(component.filteredHeroes().length).toBeGreaterThan(0);
  });

  it('should update page index and page size', () => {
    component.onPageChange({
      pageIndex: 2,
      pageSize: 10,
      length: 100,
    } as PageEvent);

    expect(component.pageIndex()).toBe(2);
    expect(component.pageSize()).toBe(10);
  });

  it('should navigate to create hero page', () => {
    spyOn(router, 'navigate');

    component.goToCreate();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to edit hero page', () => {
    spyOn(router, 'navigate');

    component.goToEdit(1);

    expect(router.navigate).toHaveBeenCalledWith(['/heroes/edit', 1]);
  });

  it('should delete hero when confirmed', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(true));
    mockConfirmDialog.open.and.returnValue(mockDialogRef);
    
    component.deleteHero(1);

    expect(mockHeroService.delete).toHaveBeenCalledWith(1);
  });

  it('should not delete hero when cancelled', () => {
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.afterClosed.and.returnValue(of(false));
    mockConfirmDialog.open.and.returnValue(mockDialogRef);
    
    component.deleteHero(1);
    
    expect(mockHeroService.delete).not.toHaveBeenCalled();
  });

});
