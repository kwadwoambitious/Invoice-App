import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { invoiceReducer } from './state/reducers/invoice.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { InvoiceEffect } from './state/effects/invoice.effect';
import { interactionsReducer } from './state/reducers/interactions.reducer';
import {
  reducers,
  metaReducers,
} from './state/reducers/local-storage-sync.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(reducers, { metaReducers }),
    provideState({ name: 'invoices', reducer: invoiceReducer }),
    provideState({ name: 'interactions', reducer: interactionsReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects([InvoiceEffect]),
    provideHttpClient(),
  ],
};
