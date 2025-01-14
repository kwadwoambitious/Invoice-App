import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { invoiceActions } from '../actions/invoice.action';
import { switchMap, map, of, withLatestFrom, catchError } from 'rxjs';
import { InvoiceService } from '../../invoice.service';
import { Store } from '@ngrx/store';
import { selectAllInvoices } from '../selectors/invoice.selector';

@Injectable({
  providedIn: 'root',
})
export class InvoiceEffect {
  private readonly actions$ = inject(Actions);
  private readonly invoiceService = inject(InvoiceService);
  private readonly storeService = inject(Store);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invoiceActions.loadInvoices),
      withLatestFrom(this.storeService.select(selectAllInvoices)),
      switchMap(([_, invoices]) => {
        if (invoices && !!invoices.length) {
          return of(invoiceActions.loadInvoicesSuccess({ invoices }));
        }

        return this.invoiceService.loadInvoices().pipe(
          map((invoices) => invoiceActions.loadInvoicesSuccess({ invoices })),
          catchError((error) =>
            of(invoiceActions.loadInvoicesFailure({ error }))
          )
        );
      })
    )
  );
}
