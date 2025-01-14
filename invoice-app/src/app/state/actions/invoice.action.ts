import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Invoice, invoiceStatus } from '../../../assets/data/model';

export const invoiceActions = createActionGroup({
  source: 'Invoice Component',
  events: {
    loadInvoices: emptyProps(),
    loadInvoicesSuccess: props<{ invoices: Invoice[] }>(),
    loadInvoicesFailure: props<{ error: any }>(),

    setActiveInvoice: props<{ invoiceId: string }>(),
    editField: props<{ path: string[]; value: any }>(),
    addInvoice: props<{ invoice: Invoice }>(),
    updateInvoice: props<{ invoice: Invoice }>(),
    deleteInvoice: props<{ invoiceId: string }>(),
    updateInvoiceStatus: props<{ invoiceId: string; status: invoiceStatus }>(),
  },
});
