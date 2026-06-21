import { Component, computed, inject, signal } from '@angular/core';
import { HeroService } from '../../../../core/services/hero.service';
import { HeroCardComponent } from '../../components/hero-card/hero-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hero-list',
  imports: [HeroCardComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {

  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal('');
  pageSize = signal(5);
  pageIndex = signal(0);

  filteredHeroes = computed(() => {
    const term = this.searchTerm();
    return term
      ? this.heroService.searchByName(term)
      : this.heroService.getAll();
  });

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });


  deleteHero(id: number) : void {
    const hero = this.heroService.getById(id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar superhéroe',
        message: `¿Estás seguro de que deseas eliminar a ${hero?.name}?`,
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.heroService.delete(id);
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/heroes/new']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/heroes/edit', id]);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

}
