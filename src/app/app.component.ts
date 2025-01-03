import { Component, effect, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectDeleteState,
  selectFormState,
} from './state/selectors/interactions.selector';
import { DialogComponent } from './components/dialog/dialog.component';
import { FormComponent } from './components/form/form.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SideMenuComponent,
    CommonModule,
    DialogComponent,
    FormComponent,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly store = inject(Store);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly renderer = inject(Renderer2);
  wantsToDelete = this.store.selectSignal(selectDeleteState);
  isFormActive = this.store.selectSignal(selectFormState);

  constructor() {
    effect(() => {
      const deleteState = this.wantsToDelete();
      const formState = this.isFormActive();

      if (deleteState || formState) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.setStyle(document.body, 'overflow', 'auto');
      }

      if (deleteState) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
