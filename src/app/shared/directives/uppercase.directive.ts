import { Directive, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  host: {
    '(input)': 'onInput($event)',
  }
})
export class UppercaseDirective implements OnInit{

  private readonly control = inject(NgControl);

  ngOnInit(): void {
    this.changeToUppercase();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    this.changeToUppercase();

    input.setSelectionRange(start, end)
  }


  private changeToUppercase(): void {
    const value = this.control.control?.value || '';
    this.control.control?.setValue(value.toUpperCase(), { emitEvent: false });
  }
}