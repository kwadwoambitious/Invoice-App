import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-field',
  imports: [],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input() type: string = 'text';
  @Input() for!: string;
  @Input() placeholder: string = '';
}
