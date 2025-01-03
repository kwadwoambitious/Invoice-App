import { Component, HostListener, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { FilterComponent } from '../filter/filter.component';
import { Store } from '@ngrx/store';
import { selectAllInvoices } from '../../state/selectors/invoice.selector';
import { TextComponent } from '../text/text.component';
import { interactionsActions } from '../../state/actions/interactions.action';

@Component({
  selector: 'app-headline',
  standalone: true,
  imports: [ButtonComponent, IconComponent, FilterComponent, TextComponent],
  templateUrl: './headline.component.html',
  styleUrl: './headline.component.css',
})
export class HeadlineComponent {
  private readonly store = inject(Store);
  invoices = this.store.selectSignal(selectAllInvoices);
  deviceWidth = window.innerWidth;

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.deviceWidth = window.innerWidth;
  }

  openForm() {
    this.store.dispatch(interactionsActions.openForm());
  }
}
