import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InvoiceState } from '../reducers/invoice.reducer';

export const selectInvoiceState =
  createFeatureSelector<InvoiceState>('invoices');

export const selectAllInvoices = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.invoices
);

export const selectLoadingState = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.isLoading
);

export const selectError = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.error
);

export const selectActiveInvoice = createSelector(
  selectInvoiceState,
  (state: InvoiceState) => state.activeInvoice
);
