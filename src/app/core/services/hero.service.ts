import { Injectable, signal } from '@angular/core';
import { SuperHero } from '../models/super-hero.model';
import { SUPER_HEROES } from '../data/super-heroes.data';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private heroes = signal<SuperHero[]>(SUPER_HEROES);

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
}