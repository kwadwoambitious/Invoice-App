import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { invoiceReducer, InvoiceState } from './invoice.reducer';
import { interactionsReducer, InteractionsState } from './interactions.reducer';

export interface AppState {
  invoices: InvoiceState;
  interactions: InteractionsState;
}

export const reducers: ActionReducerMap<AppState> = {
  invoices: invoiceReducer,
  interactions: interactionsReducer,
};

export const localStorageSyncReducer = localStorageSync({
  keys: ['invoices', 'interactions'],
  rehydrate: true,
});

export const metaReducers: MetaReducer<AppState>[] = [localStorageSyncReducer];
