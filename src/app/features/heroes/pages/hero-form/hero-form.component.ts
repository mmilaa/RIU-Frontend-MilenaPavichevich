import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeroService } from '../../../../core/services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-hero-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss',
})
export class HeroFormComponent implements OnInit{

  private readonly fb = inject(FormBuilder);
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  heroId: number | null = null;
  isEdit = false;

  heroForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    alias: ['', [Validators.required]],
    powers: ['', [Validators.required]],
    description: [''],
    imageUrl: [''],
  })


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.heroId = +id;
      this.isEdit = true;
      const hero = this.heroService.getById(this.heroId);
      if(hero){
        this.heroForm.patchValue({
          name: hero.name,
          alias: hero.alias,
          powers: hero.powers.join(', '),
          description: hero.description,
          imageUrl: hero.imageUrl,
        })
      }
    }
  }

  onSubmit(): void {
    if(this.heroForm.invalid) return

    const formValue = this.heroForm.getRawValue();
    const heroData = {
      name: formValue.name!,
      alias: formValue.alias!,
      powers: formValue.powers!.split(',').map(p => p.trim()).filter(p => p.length > 0),
      description: formValue.description || '',
      imageUrl: formValue.imageUrl || '',
    };

    if (this.isEdit && this.heroId) {
      this.heroService.update({id: this.heroId, ...heroData});
    } else {
      this.heroService.create(heroData);
    }

    this.goBack();
    
  }

  goBack(): void {
    this.router.navigate(['/heroes']);
  }

}
