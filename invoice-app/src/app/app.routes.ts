import { Routes } from '@angular/router';
import { InvoicesComponent } from './layouts/invoices/invoices.component';
import { InvoiceComponent } from './layouts/invoice/invoice.component';

export const routes: Routes = [
  {
    path: 'invoices-dashboard',
    component: InvoicesComponent,
  },
  { path: '', redirectTo: 'invoices-dashboard', pathMatch: 'full' },
  {
    path: 'invoice/:id',
    component: InvoiceComponent,
  },
];
