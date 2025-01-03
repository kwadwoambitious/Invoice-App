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
import { InvoiceService } from '../../invoice.service';
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
  private readonly invoiceService = inject(InvoiceService);
  invoices = this.store.selectSignal(selectAllInvoices);
  idSignal = signal<string | null>(null);
  invoice = computed(() =>
    this.invoices().find((inv) => inv.id === this.idSignal())
  );
  wantsToDelete = this.store.selectSignal(selectDeleteState);
  deviceWidth: number = window.innerWidth;
  public ButtonType = ButtonType;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.deviceWidth = window.innerWidth;
  }

  ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;
    this.store.dispatch(invoiceActions.setActiveInvoice({ invoiceId: id }));
    this.idSignal.set(id);

    if (!this.invoices() || this.invoices().length === 0) {
      this.store.dispatch(invoiceActions.loadInvoices());
    }
  }

  handleNaviagteBack(): void {
    this.router.navigate(['/dashboard']);
  }

  handleEditInvoice(): void {
    this.store.dispatch(interactionsActions.editForm());
  }

  onClickDeleteBtn(): void {
    this.store.dispatch(interactionsActions.handleDelete());
  }

  onChangeStatus(status: invoiceStatus | undefined): void {
    this.store.dispatch(
      invoiceActions.updateInvoiceStatus({
        invoiceId: this.idSignal() as string,
        status: 'paid',
      })
    );
  }
}
