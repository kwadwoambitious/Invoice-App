import { Routes } from '@angular/router';
import { InvoicesComponent } from './screens/invoices/invoices.component';
import { InvoiceComponent } from './screens/invoice/invoice.component';
import { PageNotFoundComponent } from './screens/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: InvoicesComponent,
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'invoice/:id',
    component: InvoiceComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
