import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDarkModeState } from '../../state/selectors/interactions.selector';
import { interactionsActions } from '../../state/actions/interactions.action';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.css',
})
export class ThemeTogglerComponent {
  public storeService = inject(Store);
  public viewportWidth = window.innerWidth;
  public isDarkMode = this.storeService.selectSignal(selectDarkModeState);

  @HostListener('window: resize', ['$event'])
  onResize(): void {
    this.viewportWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this.initializeTheme();
  }

  public themeToggler(): void {
    const newThemeState = !this.isDarkMode();
    this.storeService.dispatch(interactionsActions.toggleTheme());
    this.changeTheme(newThemeState);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    this.changeTheme(savedTheme);
    if (savedTheme !== this.isDarkMode()) {
      this.storeService.dispatch(interactionsActions.toggleTheme());
    }
  }

  private changeTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
