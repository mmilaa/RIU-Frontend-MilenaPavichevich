import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { HeroService } from '../../../../core/services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { SuperHero } from '../../../../core/models/super-hero.model';
import { provideRouter, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { of } from 'rxjs';

const MOCK_HEROES: SuperHero[] = [
    {
      id: 1,
      name: 'Superman',
      alias: 'Clark Kent',
      powers: ['Vuelo', 'Super fuerza', 'Visión láser', 'Invulnerabilidad'],
      description: 'Último hijo de Krypton y protector de la Tierra.',
      imageUrl: 'https://example.com/superman.jpg',
    },
    {
      id: 2,
      name: 'Batman',
      alias: 'Bruce Wayne',
      powers: ['Inteligencia', 'Artes marciales', 'Tecnología avanzada', 'Sigilo'],
      description: 'Vigilante de Gotham que lucha contra el crimen sin poderes.',
      imageUrl: 'https://example.com/batman.jpg',
    },
    {
      id: 3,
      name: 'Spider-Man',
      alias: 'Peter Parker',
      powers: ['Sentido arácnido', 'Agilidad', 'Escalar paredes', 'Fuerza sobrehumana'],
      description: 'Héroe joven que protege Nueva York con habilidades de araña.',
      imageUrl: 'https://example.com/spiderman.jpg',
    },
  ];

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockConfirmDialog: jasmine.SpyObj<MatDialog>;
  let router: Router;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getAll', 'getById', 'searchByName', 'create', 'update', 'delete']);
    mockHeroService.getAll.and.returnValue(MOCK_HEROES);
    mockHeroService.searchByName.and.callFake((term: string) =>
      MOCK_HEROES.filter(h => h.name.toLowerCase().includes(term.toLowerCase()))
    );
    mockHeroService.getById.and.callFake((id: number) =>
      MOCK_HEROES.find(h => h.id === id)
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

  afterEach(() => {
    localStorage.removeItem('heroesPageSize');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display heroes', () => {
    const heroes = component.paginatedHeroes();
    expect(heroes.length).toBeGreaterThan(0);
  })

  it('should display all heroes when search term is empty', () => {
    expect(component.filteredHeroes()).toEqual(MOCK_HEROES);
    expect(mockHeroService.getAll).toHaveBeenCalled();
  });

  it('should update search term and reset page index', async () => {
    
    component.pageIndex.set(3);

    component.searchControl.setValue('super');

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(component.searchTerm()).toBe('super');
    expect(component.pageIndex()).toBe(0);
    expect(component.filteredHeroes().length).toBeGreaterThan(0);

  });

  it('should set to fallbabck when search value is null', async () => {
    
    component.searchControl.setValue(null);

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(component.searchTerm()).toBe('');
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

  it('should load page size from localStorage when stored', () => {
    localStorage.setItem('heroesPageSize', '10');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HeroListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HeroService, useValue: mockHeroService },
        { provide: MatDialog, useValue: mockConfirmDialog },   
      ]
    });

    const newFixture = TestBed.createComponent(HeroListComponent);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.pageSize()).toBe(10);
  })

});
