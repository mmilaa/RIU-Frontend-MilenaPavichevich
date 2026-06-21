import { Component, computed, input, output } from '@angular/core';
import { SuperHero } from '../../../../core/models/super-hero.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-hero-card',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent {
  private readonly maxPowers = 4;

  readonly hero = input.required<SuperHero>();
  readonly fallbackImage = 'assets/images/Unknown_person.jpg';
  
  readonly visiblePowers = computed(() => this.hero().powers.slice(0, this.maxPowers));
  readonly remainingPowers = computed(() => Math.max(0, this.hero().powers.length - this.maxPowers));
  readonly hiddenPowersText = computed(() => this.hero().powers.slice(this.maxPowers).join(', '));

  readonly edit = output<SuperHero>();
  readonly delete = output<SuperHero>();

  onEdit(): void {
    this.edit.emit(this.hero());
  }

  onDelete(): void {
    this.delete.emit(this.hero());
  }
  
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
