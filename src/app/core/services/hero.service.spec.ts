import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { SuperHero } from '../models/super-hero.model';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    localStorage.clear();
    jasmine.clock().install();

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });

    service = TestBed.inject(HeroService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes', () => {
    const heroes = service.getAll();
    expect(heroes.length).toBeGreaterThan(0);
  });

  it('should return a hero by existing id', () => {
    const hero = service.getAll()[0];
    const result = service.getById(hero.id);

    expect(result).toEqual(hero);
  });

  it('should return undefined when id does not exist', () => {
    const result = service.getById(-1);
    
    expect(result).toBeUndefined();
  });

  it('should search hero by name', () => {
    const hero = service.getAll()[0];
    const term = hero.name.substring(0, 3).toLowerCase();
    const results = service.searchByName(term);
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(h => {
      expect(h.name.toLowerCase()).toContain(term);
    });
    
  })

  it('should return an empty array when no heroes are found', () => {
    const result = service.searchByName('doesNotExist');

    expect(result).toEqual([]);
  })

  it('should create a new hero with id and save to LocalStorage', () => {
    const initialLen = service.getAll().length;
    const maxId = Math.max(...service.getAll().map(h => h.id));

    const newHero = {
      name: 'Prueba Heroe',
      alias: 'Prueba',
      powers: ['volar', 'correr'],
      description: 'Heroe creado para pruebas',
      imageUrl: '',
    }

    service.create(newHero);
    jasmine.clock().tick(500);

    const heroes = service.getAll();

    expect(heroes.length).toBe(initialLen+1);

    const createdHero = heroes.find(h => h.name === 'Prueba Heroe');

    expect(createdHero).toBeDefined();
    expect(createdHero?.id).toBe(maxId + 1);

    const stored = JSON.parse(localStorage.getItem('heroes')!);
    expect(stored.length).toBe(initialLen + 1);
  });

  it('should update an existing hero and save to LocalStorage', () => {
    const hero = service.getAll()[0];

    const updatedHero = {
      ...hero,
      name: 'Nombre editado',
    };

    service.update(updatedHero);
    jasmine.clock().tick(500);

    const result = service.getById(hero.id);
    expect(result?.name).toBe('Nombre editado');

    const stored = JSON.parse(localStorage.getItem('heroes')!);
    expect(stored.find((h: SuperHero) => h.id === hero.id)?.name).toBe('Nombre editado');
  });

  it('should delete a hero and save to LocalStorage', () => {
    const hero = service.getAll()[0];
    const initialLen = service.getAll().length;

    service.delete(hero.id);
    jasmine.clock().tick(500);

    expect(service.getAll().length).toBe(initialLen - 1);
    expect(service.getById(hero.id)).toBeUndefined();

    const stored = JSON.parse(localStorage.getItem('heroes')!);
    expect(stored.find((h: SuperHero) => h.id === hero.id)).toBeUndefined();
  });


});
