import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-hero-list',
  imports: [HeroCardComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatPaginatorModule, ReactiveFormsModule],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {

  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageSizeKey = 'heroesPageSize';

  searchControl = new FormControl('');
  searchTerm = signal('');
  pageSize = signal(this.loadPageSize());
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

  totalPages = computed(() => Math.ceil(this.filteredHeroes().length / this.pageSize()));

  constructor(){

    effect(() => {
      const total = this.totalPages();
      if (this.pageIndex() >= total && total > 0) {
        this.pageIndex.set(total - 1);
      }
    });
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(value => {
      this.searchTerm.set(value || '');
      this.pageIndex.set(0);
    })
  }


  deleteHero(id: number) : void {
    const hero = this.heroService.getById(id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar superhéroe',
        message: `¿Estás seguro de que deseas eliminar a ${hero?.name}?`,
      },
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(confirmed => {
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

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    localStorage.setItem(this.pageSizeKey, String(event.pageSize));
  }

  private loadPageSize(): number {
    const stored = localStorage.getItem(this.pageSizeKey);
    return stored ? +stored : 5;
  }

}
