import { createReducer, on } from '@ngrx/store';
import { Invoice } from '../../../assets/data/model';
import { invoiceActions } from '../actions/invoice.action';

export interface InvoiceState {
  invoices: Invoice[];
  activeInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
}

const initialInvoiceState: InvoiceState = {
  invoices: [],
  activeInvoice: null,
  isLoading: false,
  error: null,
};

const {
  loadInvoices,
  loadInvoicesSuccess,
  loadInvoicesFailure,
  deleteInvoice,
  updateInvoice,
  updateInvoiceStatus,
  addInvoice,
  setActiveInvoice,
  editField,
} = invoiceActions;

export const invoiceReducer = createReducer(
  initialInvoiceState,

  on(loadInvoices, (state) => ({
    ...state,
    isLoading: state.invoices.length === 0,
    error: null,
  })),

  on(loadInvoicesSuccess, (state, { invoices }) => ({
    ...state,
    isLoading: false,
    invoices: [
      ...state.invoices.filter((inv) =>
        invoices.every((newInv) => newInv.id !== inv.id)
      ),
      ...invoices,
    ],
  })),

  on(loadInvoicesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(setActiveInvoice, (state, { invoiceId }) => ({
    ...state,
    activeInvoice: state.invoices.find(
      (inv) => inv.id === invoiceId
    ) as Invoice,
  })),

  on(addInvoice, (state, { invoice }) => ({
    ...state,
    invoices: [...state.invoices, invoice],
  })),

  on(updateInvoice, (state, { invoice }) => ({
    ...state,
    invoices: state.invoices.map((inv) =>
      inv.id === invoice.id ? { ...inv, ...invoice } : inv
    ),
    activeInvoice: invoice,
  })),

  on(deleteInvoice, (state, { invoiceId }) => ({
    ...state,
    invoices: state.invoices.filter((inv) => inv.id !== invoiceId),
  })),

  on(updateInvoiceStatus, (state, { invoiceId, status }) => ({
    ...state,
    invoices: state.invoices.map((inv) =>
      inv.id === invoiceId ? { ...inv, status } : inv
    ),
  })),

  on(editField, (state, { path, value }) => {
    if (!state.activeInvoice) return state;

    const updateNestedField = (obj: any, path: string[], value: any): any => {
      if (path.length === 1) {
        return { ...obj, [path[0]]: value };
      }
      const [key, ...rest] = path;
      return {
        ...obj,
        [key]: updateNestedField(obj[key], rest, value),
      };
    };

    const updatedActiveInvoice = updateNestedField(
      state.activeInvoice,
      path,
      value
    );

    return {
      ...state,
      activeInvoice: updatedActiveInvoice,
      invoices: state.invoices.map((inv) =>
        inv.id === updatedActiveInvoice.id ? updatedActiveInvoice : inv
      ),
    };
  })
);
