import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { SuperHero } from '../models/super-hero.model';

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
    id: 3,
    name: 'Spider-Man',
    alias: 'Peter Parker',
    powers: ['Sentido arácnido', 'Agilidad', 'Escalar paredes', 'Fuerza sobrehumana'],
    description: 'Héroe joven que protege Nueva York con habilidades de araña.',
    imageUrl: 'https://example.com/spiderman.jpg',
  },
  {
    id: 2,
    name: 'Batman',
    alias: 'Bruce Wayne',
    powers: ['Inteligencia', 'Artes marciales', 'Tecnología avanzada', 'Sigilo'],
    description: 'Vigilante de Gotham que lucha contra el crimen sin poderes.',
    imageUrl: 'https://example.com/batman.jpg',
  },
];

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('heroes', JSON.stringify(MOCK_HEROES));
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
    expect(heroes.length).toBe(MOCK_HEROES.length);
  });

  it('should return a hero by existing id', () => {
    const result = service.getById(1);

    expect(result).toEqual(MOCK_HEROES[0]);
  });

  it('should return undefined when id does not exist', () => {
    const result = service.getById(-1);
    
    expect(result).toBeUndefined();
  });

  it('should search hero by name', () => {
    const results = service.searchByName('superman');
    
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Superman');
    
  })

  it('should return an empty array when no heroes are found', () => {
    const result = service.searchByName('doesNotExist');

    expect(result).toEqual([]);
  })

  it('should create a new hero with id and save to LocalStorage', async () => {
    const maxId = Math.max(...MOCK_HEROES.map(h => h.id));

    const newHero = {
      name: 'Prueba Heroe',
      alias: 'Prueba',
      powers: ['volar', 'correr'],
      description: 'Heroe creado para pruebas',
      imageUrl: '',
    };

    service.create(newHero);
    jasmine.clock().tick(500);

    const heroes = service.getAll();
    expect(heroes.length).toBe(MOCK_HEROES.length + 1);

    const createdHero = heroes.find(h => h.name === 'Prueba Heroe');
    expect(createdHero).toBeDefined();
    expect(createdHero?.id).toBe(maxId + 1);

    const stored = JSON.parse(localStorage.getItem('heroes')!);
    expect(stored.length).toBe(MOCK_HEROES.length + 1);
  });

  it('should update an existing hero and save to LocalStorage', () => {
    const hero = MOCK_HEROES[0];

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
    const hero = MOCK_HEROES[0];
    const initialLen = MOCK_HEROES.length;

    service.delete(hero.id);
    jasmine.clock().tick(500);

    expect(service.getAll().length).toBe(initialLen - 1);
    expect(service.getById(hero.id)).toBeUndefined();

    const stored = JSON.parse(localStorage.getItem('heroes')!);
    expect(stored.find((h: SuperHero) => h.id === hero.id)).toBeUndefined();
  });

  it('should fallback to default data when localStorage is corrupted', () => {
    localStorage.setItem('heroes', 'invalid {{');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });

    const newService = TestBed.inject(HeroService);
    expect(newService.getAll().length).toBeGreaterThan(0);
  });

  it('should fallback to default data when localStorage is empty', () => {
    localStorage.removeItem('heroes');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()]
    });

    const newService = TestBed.inject(HeroService);
    expect(newService.getAll().length).toBeGreaterThan(0);
  });

});