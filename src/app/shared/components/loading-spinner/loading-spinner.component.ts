import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
})
export class LoadingSpinnerComponent {
  private readonly loadingService = inject(LoadingService);
  protected readonly loading = this.loadingService.loading;
}
