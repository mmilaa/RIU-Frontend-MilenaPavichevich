import { Component, provideZonelessChangeDetection } from '@angular/core';
import { UppercaseDirective } from './uppercase.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  imports: [ReactiveFormsModule, UppercaseDirective],
  template: `
    <input [formControl]="nameControl" appUppercase />
  `,

})
class TestComponent {
  nameControl = new FormControl('');
}


describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input');
  });

  it('should create TestComponent', () => {
    expect(component).toBeTruthy();
  });
    
  it('should convert input value to uppercase', () => {
    input.value = 'superman';
    input.dispatchEvent(new Event('input'));

    expect(component.nameControl.value).toBe('SUPERMAN');
  });

  it('should convert initial value to uppercase on init', () => {

    const newFixture = TestBed.createComponent(TestComponent);
    newFixture.componentInstance.nameControl.setValue('robin');
    newFixture.detectChanges()

    expect(newFixture.componentInstance.nameControl.value).toBe('ROBIN');
  });

  it('should preserve cursor position when editing in the middle', () => {
    input.value = 'SUPERxMAN';
    input.setSelectionRange(6, 6);
    input.dispatchEvent(new Event('input'));

    expect(component.nameControl.value).toBe('SUPERXMAN');
    expect(input.selectionStart).toBe(6);
    expect(input.selectionEnd).toBe(6);
  });


});
