import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './text.component.html',
  styleUrl: './text.component.css',
})
export class TextComponent {
  @Input() type: 'regular' | 'bold' = 'regular';
  @Input() size!: string;
  @Input() color!: string;
}
