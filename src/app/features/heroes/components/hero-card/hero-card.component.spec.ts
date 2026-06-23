import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCardComponent } from './hero-card.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { SuperHero } from '../../../../core/models/super-hero.model';

describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

  const mockHero: SuperHero = {
    id: 1,
    name: 'Superman',
    alias: 'Clark Kent',
    powers: ['Vuelo', 'Super fuerza', 'Visión láser', 'Invulnerabilidad', 'Velocidad'],
    description: 'Último hijo de Krypton.',
    imageUrl: 'https://example.com/superman.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroCardComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hero', mockHero);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display hero data', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockHero.name);
    expect(compiled.textContent).toContain(mockHero.alias);
    expect(compiled.textContent).toContain(mockHero.description);

    const visiblePowers = mockHero.powers.slice(0,4);
    visiblePowers.forEach(power => {
      expect(compiled.textContent).toContain(power)
    });

  })

  it('should display hero image', () => {
    const image = fixture.nativeElement.querySelector('img');

    expect(image.src).toContain(mockHero.imageUrl);
  })
  
  it('should display fallback image when hero image fails', () => {
    const image = fixture.nativeElement.querySelector('img');

    component.onImageError({
      target: image,
    } as Event);

    expect(image.src).toContain(component.fallbackImage);
  });

  it('should emit hero when edit is clicked', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledWith(mockHero.id);
  });

  it('should emit hero when delete is clicked', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledWith(mockHero.id);
  });


});
