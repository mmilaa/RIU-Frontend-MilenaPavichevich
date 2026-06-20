import { Component, inject, signal } from '@angular/core';
import { HeroService } from '../../../../core/services/hero.service';
import { SuperHero } from '../../../../core/models/super-hero.model';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';

@Component({
  selector: 'app-hero-list',
  imports: [HeroCardComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {

  private readonly heroService = inject(HeroService);

  heroes = signal<SuperHero[]>(this.heroService.getAll());

  deleteHero(id: number) {
    console.log('borrar', id);
  }

  goToCreate() {
    console.log('crear');
  }

  goToEdit(id: number) {
    console.log('editar', id);
  }

}
