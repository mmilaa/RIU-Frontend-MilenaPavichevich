import { effect, Injectable, signal } from '@angular/core';
import { SuperHero } from '../models/super-hero.model';
import { SUPER_HEROES } from '../data/super-heroes.data';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private readonly storageKey = 'heroes';

  private heroes = signal<SuperHero[]>(this.loadFromStorage());

  constructor() {
    effect(() => this.saveToStorage(this.heroes()));
  }

  getAll(): SuperHero[] {
    return this.heroes();
  }

  getById(id: number): SuperHero | undefined {
    return this.heroes().find(hero => hero.id === id);
  }

  searchByName(name: string): SuperHero[] {
    const lowerName = name.toLowerCase().trim();

    return this.heroes().filter(hero =>
      hero.name.toLowerCase().includes(lowerName)
    );
  }

  create(hero: Omit<SuperHero, 'id'>): void {
    const newHero: SuperHero = {
      id: this.generateId(),
      ...hero,
    };

    this.heroes.update(currentHeroes => [
      ...currentHeroes,
      newHero,
    ]);
  }

  update(hero: SuperHero): void {
    this.heroes.update(currentHeroes =>
      currentHeroes.map(h => h.id === hero.id ? hero : h)
    );
  }

  delete(id: number): void {
    this.heroes.update(currentHeroes =>
      currentHeroes.filter(hero => hero.id !== id)
    );
  }

  private generateId(): number {
    const list = this.heroes();

    return list.length > 0
      ? Math.max(...list.map(h => h.id)) + 1
      : 1;
  }

  private loadFromStorage(): SuperHero[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : SUPER_HEROES;
  }

  private saveToStorage(heroes: SuperHero[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(heroes));
  }


}