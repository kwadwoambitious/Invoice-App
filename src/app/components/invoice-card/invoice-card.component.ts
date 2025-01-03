import { Component, effect, HostListener, inject } from '@angular/core';
import { TextComponent } from '../text/text.component';
import { Store } from '@ngrx/store';
import {
  selectAllInvoices,
  selectLoadingState,
} from '../../state/selectors/invoice.selector';
import { invoiceActions } from '../../state/actions/invoice.action';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-card',
  standalone: true,
  imports: [
    TextComponent,
    CurrencyPipe,
    IconComponent,
    DatePipe,
    BadgeComponent,
    CommonModule,
  ],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  invoices = this.store.selectSignal(selectAllInvoices);
  isLoading = this.store.selectSignal(selectLoadingState);
  deviceWidth: number = window.innerWidth;

  constructor() {
    effect(() => {
      if (!this.isLoading() && !this.invoices().length) {
        this.store.dispatch(invoiceActions.loadInvoices());
      }
    });
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.deviceWidth = window.innerWidth;
  }

  handleNavigate(id: string) {
    this.router.navigate(['/invoice', id]);
  }
}
