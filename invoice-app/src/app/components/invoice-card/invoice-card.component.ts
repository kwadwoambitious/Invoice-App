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
  private readonly storeService = inject(Store);
  private readonly router = inject(Router);
  public allInvoices = this.storeService.selectSignal(selectAllInvoices);
  public isLoading = this.storeService.selectSignal(selectLoadingState);
  public viewportWidth = window.innerWidth;

  constructor() {
    effect(() => {
      if (!this.isLoading() && !this.allInvoices().length) {
        this.storeService.dispatch(invoiceActions.loadInvoices());
      }
    });
  }

  @HostListener('window: resize', ['$event'])
  onResize(event: Event): void {
    this.viewportWidth = window.innerWidth;
  }

  public navigationHandler(id: string): void {
    this.router.navigate(['/invoice', id]);
  }
}
