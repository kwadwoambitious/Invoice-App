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
  store = inject(Store);
  deviceWidth: number = window.innerWidth;
  isDarkMode = this.store.selectSignal(selectDarkModeState);

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.deviceWidth = window.innerWidth;
  }
  ngOnInit(): void {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const newThemeState = !this.isDarkMode();
    this.store.dispatch(interactionsActions.toggleTheme());
    this.updateTheme(newThemeState);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    this.updateTheme(savedTheme);
    if (savedTheme !== this.isDarkMode()) {
      this.store.dispatch(interactionsActions.toggleTheme());
    }
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
