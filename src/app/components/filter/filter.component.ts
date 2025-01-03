import { Component, HostListener } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [IconComponent, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  public isShown!: boolean;
  public viewportWidth = window.innerWidth;

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.viewportWidth = window.innerWidth;
  }
  public toggleMenu(): void {
    this.isShown = !this.isShown;
  }
}
