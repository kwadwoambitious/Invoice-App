import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextComponent } from '../text/text.component';
import { ButtonComponent } from '../button/button.component';
import { Store } from '@ngrx/store';
import { interactionsActions } from '../../state/actions/interactions.action';
import { IconComponent } from '../icon/icon.component';
import { Invoice, Item } from '../../../assets/data/model';
import { CommonModule } from '@angular/common';
import { invoiceActions } from '../../state/actions/invoice.action';
import { addDays } from 'date-fns';
import { selectActiveInvoice } from '../../state/selectors/invoice.selector';
import {
  selectDarkModeState,
  selectEditState,
} from '../../state/selectors/interactions.selector';
import { ButtonType } from '../button/button-type.enum';

@Component({
  selector: 'app-form',
  imports: [
    TextComponent,
    ButtonComponent,
    IconComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly elementRef = inject(ElementRef);
  private readonly fb = inject(FormBuilder);
  public isShown!: boolean;
  public isMouseOver!: boolean;
  public formIsSubmitted!: boolean;
  public viewportWidth: number = window.innerWidth;
  public ButtonType = ButtonType;
  public invoiceCreationForm!: FormGroup;
  public paymentDetails = signal<number>(1);
  public invoiceSelected = this.store.selectSignal(selectActiveInvoice);
  public invoiceSelectedCopy!: Invoice;
  public formIsEditing = this.store.selectSignal(selectEditState);
  public darkModeEnabled = this.store.selectSignal(selectDarkModeState);
  public paymentDeadline = computed(() => {
    const createdAt =
      this.invoiceCreationForm?.get('createdAt')?.value || new Date();
    return addDays(new Date(createdAt), this.paymentDetails());
  });
  public itemsQuantity = signal<number>(0);
  public itemsList = computed(() =>
    new Array<Item>(this.itemsQuantity()).fill({
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
    })
  );

  public ngOnInit(): void {
    this.initializeForm();

    if (this.formIsEditing()) {
      this.populateForm(this.invoiceSelected() as Invoice);
      this.invoiceSelectedCopy = this.invoiceSelected() as Invoice;
    }

    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    this.invoiceCreationForm = this.fb.group({
      id: [this.generateId()],
      createdAt: [new Date()],
      paymentDeadline: ['', Validators.required],
      description: ['', Validators.required],
      paymentDetails: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['pending'],
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.fb.array([this.createItem()]),
      total: [{ value: 0 }],
    });
  }

  private setupFormSubscriptions(): void {
    const paymentDetailsControl =
      this.invoiceCreationForm.get('paymentDetails');
    const createdAtControl = this.invoiceCreationForm.get('createdAt');

    if (paymentDetailsControl && createdAtControl) {
      paymentDetailsControl.valueChanges.subscribe((value) => {
        this.paymentDetails.set(Number(value));
        this.updatePaymentDue();
      });
      createdAtControl.valueChanges.subscribe(() => this.updatePaymentDue());
    }

    this.invoiceCreationForm.valueChanges.subscribe((formValue) => {
      this.syncFormWithStore(formValue);
    });

    this.setupItemsCalculations();
  }

  private setupItemsCalculations(): void {
    const itemsList = this.items;
    itemsList.controls.forEach((control) => {
      ['quantity', 'price'].forEach((field) => {
        control
          .get(field)
          ?.valueChanges.subscribe(() => this.updateItemAndFormTotal(control));
      });
    });
  }

  private updateItemAndFormTotal(item: FormGroup): void {
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const total = quantity * price;

    item.get('total')?.setValue(total, { emitEvent: false });
    this.updateFormTotal();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    this.viewportWidth = window.innerWidth;
  }

  private syncFormWithStore(formValue: any, parentPath: string[] = []): void {
    Object.keys(formValue).forEach((key) => {
      const path = [...parentPath, key];
      const control = this.invoiceCreationForm.get(path.join('.'));

      if (control?.value !== undefined && control.dirty) {
        this.updateField(path, control.value);
      }

      if (
        typeof formValue[key] === 'object' &&
        !Array.isArray(formValue[key])
      ) {
        this.syncFormWithStore(formValue[key], path);
      }
    });
  }

  private resetFormAndClose(): void {
    this.invoiceCreationForm.reset();
    this.itemsQuantity.set(0);
    this.items.clear();
    this.store.dispatch(interactionsActions.closeForm());
  }

  private updateFormTotal(): void {
    const total = this.items.controls.reduce((sum, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return sum + quantity * price;
    }, 0);
    this.invoiceCreationForm
      .get('total')
      ?.setValue(total, { emitEvent: false });
  }

  public createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required]],
      total: [{ value: 0, disabled: true }],
    });
  }

  public get items(): FormArray<FormGroup> {
    return this.invoiceCreationForm.get('items') as FormArray<FormGroup>;
  }

  private generateId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    return `${randomLetters}${randomDigits}`;
  }

  public populateForm(invoice: Invoice): void {
    this.invoiceCreationForm.patchValue(invoice);

    const itemsControl = this.invoiceCreationForm.get('items') as FormArray;
    itemsControl.clear();

    if (invoice.items) {
      invoice.items.forEach((item) => {
        itemsControl.push(
          this.fb.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            price: [item.price, [Validators.required]],
            total: [{ value: item.total, disabled: true }],
          })
        );
      });
    }

    this.itemsQuantity.set(invoice.items?.length || 0);
  }

  private updatePaymentDue(): void {
    const createdAt =
      this.invoiceCreationForm.get('createdAt')?.value || new Date();
    const paymentDeadlineDate = addDays(
      new Date(createdAt),
      this.paymentDetails()
    );
    this.invoiceCreationForm
      .get('paymentDeadline')
      ?.setValue(paymentDeadlineDate, { emitEvent: false });
  }

  private updateField(path: string[], value: any): void {
    this.store.dispatch(invoiceActions.editField({ path, value }));
  }

  public toggleDropdown(): void {
    this.isShown = !this.isShown;
  }

  public getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private handleFormSubmission(isDraft: boolean = false): void {
    if (!isDraft && !this.invoiceCreationForm.valid) {
      this.formIsSubmitted = true;
      return;
    }

    const invoice = this.invoiceCreationForm.getRawValue();
    invoice.status = isDraft ? 'draft' : 'pending';

    this.store.dispatch(
      this.formIsEditing()
        ? invoiceActions.updateInvoice({ invoice })
        : invoiceActions.addInvoice({ invoice })
    );

    this.resetFormAndClose();
    this.formIsSubmitted = false;
  }

  public handleDraft(): void {
    this.handleFormSubmission(true);
  }

  public handleSend(): void {
    this.handleFormSubmission(false);
  }

  public handleAddItem(): void {
    this.items.push(this.createItem());
    this.updateFormTotal();
  }

  public handleDeleteItem(index: number): void {
    this.items.removeAt(index);
    this.updateFormTotal();
  }

  public hasError(controlName: string, errorName: string): boolean {
    const control = this.invoiceCreationForm.get(controlName);
    return (this.formIsSubmitted && control?.hasError(errorName)) ?? false;
  }

  public onSubmit(): void {
    console.log(this.invoiceCreationForm.value);
  }

  public updateTotal(index: number): void {
    const item = this.items.at(index);
    this.updateItemAndFormTotal(item);
  }

  public handleDiscard(): void {
    if (this.formIsEditing()) {
      this.populateForm(this.invoiceSelectedCopy);
      this.store.dispatch(interactionsActions.closeForm());
    } else {
      this.resetFormAndClose();
    }
  }
}
