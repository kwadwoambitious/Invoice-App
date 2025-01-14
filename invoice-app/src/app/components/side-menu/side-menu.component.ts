import { Component, HostListener } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { AvatarComponent } from '../avatar/avatar.component';
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [IconComponent, AvatarComponent, ThemeTogglerComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css',
})
export class SideMenuComponent {
  public viewportWidth = window.innerWidth;

  @HostListener('window: resize', ['$event'])
  onResize(): void {
    this.viewportWidth = window.innerWidth;
  }
}
