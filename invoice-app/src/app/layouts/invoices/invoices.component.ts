import { Component, inject, OnInit } from '@angular/core';
import { HeadlineComponent } from '../../components/headline/headline.component';
import { Store } from '@ngrx/store';
import { invoiceActions } from '../../state/actions/invoice.action';
import {
  selectAllInvoices,
  selectLoadingState,
} from '../../state/selectors/invoice.selector';
import { InvoiceCardComponent } from '../../components/invoice-card/invoice-card.component';
import { IconComponent } from '../../components/icon/icon.component';
import { TextComponent } from '../../components/text/text.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    HeadlineComponent,
    InvoiceCardComponent,
    IconComponent,
    TextComponent,
  ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent implements OnInit {
  private readonly storeService = inject(Store);
  public isLoading = this.storeService.selectSignal(selectLoadingState);
  public allInvoices = this.storeService.selectSignal(selectAllInvoices);

  ngOnInit(): void {
    if (!this.isLoading()) {
      this.storeService.dispatch(invoiceActions.loadInvoices());
    }
  }
}
