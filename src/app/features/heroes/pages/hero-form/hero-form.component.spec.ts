import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroFormComponent } from './hero-form.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, convertToParamMap, ParamMap, provideRouter, Router } from '@angular/router';
import { SuperHero } from '../../../../core/models/super-hero.model';
import { HeroService } from '../../../../core/services/hero.service';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockActivatedRoute: { snapshot: { paramMap: ParamMap } };
  let router: Router;
  
  const mockHero: SuperHero = {
    id: 1,
    name: 'Superman',
    alias: 'Clark Kent',
    powers: ['Vuelo', 'Super fuerza', 'Visión láser', 'Invulnerabilidad', 'Velocidad'],
    description: 'Último hijo de Krypton.',
    imageUrl: 'https://example.com/superman.jpg',
  };

  beforeEach(async () => {

    mockHeroService = jasmine.createSpyObj('HeroService', ['getById','create', 'update']);
    mockHeroService.getById.and.returnValue(mockHero); 

    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({})
      }
    }

    await TestBed.configureTestingModule({
      imports: [HeroFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HeroService, useValue: mockHeroService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    
    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when is empty', () => {
    expect(component.heroForm.valid).toBeFalse();
  })

  it('should initialize in create mode when there is no id', () => {
    component.ngOnInit();

    expect(component.isEdit).toBeFalse();
    expect(component.heroId).toBeNull();
  })

  it('should load hero data in edit mode', () => {

    mockActivatedRoute.snapshot.paramMap = convertToParamMap({id: '1'});

    component.ngOnInit();

    expect(component.isEdit).toBeTrue();
    expect(component.heroId).toBe(1);

    expect(component.heroForm.value.name).toBe(mockHero.name);
    expect(component.heroForm.value.alias).toBe(mockHero.alias);
  });

  it('should call create on submit when in create mode', () => {
    component.heroForm.patchValue({
      name: 'Nuevo heroe',
      alias: 'Nuevo',
      description: 'Test crear nuevo heroe',
      powers: 'Vuelo, Fuerza, Rayos laser'
    });

    component.onSubmit();

    expect(mockHeroService.create).toHaveBeenCalled();
  });

  it('should call update on submit when in edit mode', () => {
    
    component.isEdit = true;
    component.heroId = 1;
    component.heroForm.patchValue({
      name: 'Edito heroe',
      alias: 'Editado',
      description: 'Test editar nuevo heroe',
      powers: 'Vuelo, Rayos laser'
    });

    component.onSubmit();

    expect(mockHeroService.update).toHaveBeenCalled();
  });
  
  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(mockHeroService.create).not.toHaveBeenCalled();
    expect(mockHeroService.update).not.toHaveBeenCalled();
  });

  it('should validate name min length', () => {
    component.heroForm.patchValue({ name: 'AB', alias: 'Test', powers: 'Vuelo' });

    expect(component.heroForm.valid).toBeFalse();
    expect(component.heroForm.get('name')?.hasError('minlength')).toBeTrue();
  });

  it('should be valid when required fields are filled', () => {
    component.heroForm.patchValue({
      name: 'Test Hero',
      alias: 'Tester',
      powers: 'Vuelo, Fuerza',
    });

    expect(component.heroForm.valid).toBeTrue();
  });

  it('should navigate back on goBack', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  })


});
