import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input() imgSrc!: string;
  @Input() altText!: string;
  @Input() width!: number;
  @Input() height!: number;
  @Input() rotationAngle!: string;
  @Input() isSelectable = true;
  @Output() onClick = new EventEmitter();

  public clickHandler(): void {
    this.onClick.emit();
  }
}
