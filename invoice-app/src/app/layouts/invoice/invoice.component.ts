import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { IconComponent } from '../../components/icon/icon.component';
import { TextComponent } from '../../components/text/text.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllInvoices } from '../../state/selectors/invoice.selector';
import { ButtonComponent } from '../../components/button/button.component';
import { invoiceActions } from '../../state/actions/invoice.action';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DeleteCardComponent } from '../../components/delete-card/delete-card.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { selectDeleteState } from '../../state/selectors/interactions.selector';
import { interactionsActions } from '../../state/actions/interactions.action';
import { invoiceStatus } from '../../../assets/data/model';
import { ButtonType } from '../../components/button/button-type.enum';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    IconComponent,
    TextComponent,
    BadgeComponent,
    ButtonComponent,
    DatePipe,
    CurrencyPipe,
    DeleteCardComponent,
    DialogComponent,
    CommonModule,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  public allInvoices = this.store.selectSignal(selectAllInvoices);
  public idSignal = signal<string | null>(null);
  public invoice = computed(() =>
    this.allInvoices().find((inv) => inv.id === this.idSignal())
  );
  public isDeleteDialogOpen = this.store.selectSignal(selectDeleteState);
  public viewportWidth = window.innerWidth;
  public ButtonType = ButtonType;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewportWidth = window.innerWidth;
  }

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.store.dispatch(invoiceActions.setActiveInvoice({ invoiceId: id }));
    this.idSignal.set(id);

    if (!this.allInvoices() || this.allInvoices().length === 0) {
      this.store.dispatch(invoiceActions.loadInvoices());
    }
  }

  public navigateToDashboard(): void {
    this.router.navigate(['/invoices-dashboard']);
  }

  public openEditForm(): void {
    this.store.dispatch(interactionsActions.editForm());
  }

  public deleteHandler(): void {
    this.store.dispatch(interactionsActions.handleDelete());
  }

  public onChangeStatus(status: invoiceStatus | undefined): void {
    this.store.dispatch(
      invoiceActions.updateInvoiceStatus({
        invoiceId: this.idSignal() as string,
        status: status ?? 'paid',
      })
    );
  }
}
