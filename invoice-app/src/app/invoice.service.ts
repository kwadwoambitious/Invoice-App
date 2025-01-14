import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Invoice } from '../assets/data/model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly http = inject(HttpClient);

  loadInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>('/assets/data/data.json').pipe(
      catchError((error) => {
        console.error('Error loading invoices', error);
        return [];
      })
    );
  }
}
