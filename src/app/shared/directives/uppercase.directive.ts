import { Directive, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  host: {
    '(input)': 'onInput()'
  }
})
export class UppercaseDirective implements OnInit{

  private readonly control = inject(NgControl);

  ngOnInit(): void {
    this.changeToUppercase();
  }

  onInput(){
    this.changeToUppercase()
  }

  private changeToUppercase(): void {
    const value = this.control.control?.value || '';
    this.control.control?.setValue(value.toUpperCase(), { emitEvent: false });
  }
}