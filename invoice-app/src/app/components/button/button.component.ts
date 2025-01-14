import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from './button-type.enum';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: ButtonType = ButtonType.Regular;
  @Input() color!: string;
  @Input() disabled!: boolean;
  @Output() onClick = new EventEmitter();

  public clickHandler(event: Event): void {
    event.preventDefault();
    this.onClick.emit();
  }
}
