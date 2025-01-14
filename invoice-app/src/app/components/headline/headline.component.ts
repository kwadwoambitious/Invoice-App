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
  private readonly storeService = inject(Store);
  public allInvoices = this.storeService.selectSignal(selectAllInvoices);
  public viewportWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.viewportWidth = window.innerWidth;
  }

  public openInvoiceForm(): void {
    this.storeService.dispatch(interactionsActions.openForm());
  }
}
