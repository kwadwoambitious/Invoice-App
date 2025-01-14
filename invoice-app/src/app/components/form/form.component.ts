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
  private readonly storeService = inject(Store);
  private readonly elementReference = inject(ElementRef);
  private readonly formBuilder = inject(FormBuilder);
  public dropdownVisible!: boolean;
  public isMouseOver!: boolean;
  public formSubmitted!: boolean;
  public viewportWidth: number = window.innerWidth;
  public ButtonTypeEnum = ButtonType;
  public invoiceCreationForm!: FormGroup;
  public paymentTerms = signal<number>(1);
  public selectedInvoice = this.storeService.selectSignal(selectActiveInvoice);
  public selectedInvoiceCopy!: Invoice;
  public formIsEditing = this.storeService.selectSignal(selectEditState);
  public darkModeEnabled = this.storeService.selectSignal(selectDarkModeState);
  public paymentDueDate = computed(() => {
    const createdAt =
      this.invoiceCreationForm?.get('createdAt')?.value || new Date();
    return addDays(new Date(createdAt), this.paymentTerms());
  });
  public itemCount = signal<number>(0);
  public itemList = computed(() =>
    new Array<Item>(this.itemCount()).fill({
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
    })
  );

  public ngOnInit(): void {
    this.setupForm();

    if (this.formIsEditing()) {
      this.fillForm(this.selectedInvoice() as Invoice);
      this.selectedInvoiceCopy = this.selectedInvoice() as Invoice;
    }

    this.initializeFormSubscriptions();
  }

  private setupForm(): void {
    this.invoiceCreationForm = this.formBuilder.group({
      id: [this.generateUniqueId()],
      createdAt: [{ value: new Date() }],
      paymentDueDate: ['', Validators.required],
      description: ['', Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['pending'],
      senderAddress: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      clientAddress: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.formBuilder.array([this.createItem()]),
      total: [{ value: 0, disabled: true }],
    });
  }

  private initializeFormSubscriptions(): void {
    const paymentTermsControl =
      this.invoiceCreationForm.get('paymentTerms');
    const createdAtControl = this.invoiceCreationForm.get('createdAt');

    if (paymentTermsControl && createdAtControl) {
      paymentTermsControl.valueChanges.subscribe((value) => {
        this.paymentTerms.set(Number(value));
        this.updatePaymentDueDate();
      });
      createdAtControl.valueChanges.subscribe(() => this.updatePaymentDueDate());
    }

    this.invoiceCreationForm.valueChanges.subscribe((formValue) => {
      this.syncFormWithState(formValue);
    });

    this.initializeItemCalculations();

    this.invoiceCreationForm.get('paymentTerms')?.valueChanges.subscribe(() => {
      this.dropdownVisible = false;
    });
  }

  private initializeItemCalculations(): void {
    const itemList = this.items;
    itemList.controls.forEach((control) => {
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

  private syncFormWithState(formValue: any, parentPath: string[] = []): void {
    if (!formValue) return; // Add null check

    Object.keys(formValue).forEach((key) => {
      const path = [...parentPath, key];
      const control = this.invoiceCreationForm.get(path.join('.'));

      if (control?.value !== undefined && control.dirty) {
        this.updateFieldInState(path, control.value);
      }

      if (
        typeof formValue[key] === 'object' &&
        !Array.isArray(formValue[key])
      ) {
        this.syncFormWithState(formValue[key], path);
      }
    });
  }

  private resetFormAndClose(): void {
    this.invoiceCreationForm.reset();
    this.itemCount.set(0);
    this.items.clear();
    this.storeService.dispatch(interactionsActions.closeForm());
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
    return this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required]],
      total: [{ value: 0, disabled: true }],
    });
  }

  public get items(): FormArray<FormGroup> {
    return this.invoiceCreationForm.get('items') as FormArray<FormGroup>;
  }

  private generateUniqueId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    return `${randomLetters}${randomDigits}`;
  }

  public fillForm(invoice: Invoice): void {
    this.invoiceCreationForm.patchValue(invoice);

    const itemsControl = this.invoiceCreationForm.get('items') as FormArray;
    itemsControl.clear();

    if (invoice.items) {
      invoice.items.forEach((item) => {
        itemsControl.push(
          this.formBuilder.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            price: [item.price, [Validators.required]],
            total: [{ value: item.total, disabled: true }],
          })
        );
      });
    }

    this.itemCount.set(invoice.items?.length || 0);
  }

  private updatePaymentDueDate(): void {
    const createdAt =
      this.invoiceCreationForm.get('createdAt')?.value || new Date();
    const paymentDueDate = addDays(
      new Date(createdAt),
      this.paymentTerms()
    );
    this.invoiceCreationForm
      .get('paymentDueDate')
      ?.setValue(paymentDueDate, { emitEvent: false });
  }

  private updateFieldInState(path: string[], value: any): void {
    this.storeService.dispatch(invoiceActions.editField({ path, value }));
  }

  public toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  public getNativeElement(): HTMLElement {
    return this.elementReference.nativeElement;
  }

  private handleFormSubmission(isDraft: boolean = false): void {
    if (!isDraft && !this.invoiceCreationForm.valid) {
      this.formSubmitted = true;
      return;
    }

    const invoice = this.invoiceCreationForm.getRawValue();
    invoice.status = isDraft ? 'draft' : 'pending';

    this.storeService.dispatch(
      this.formIsEditing()
        ? invoiceActions.updateInvoice({ invoice })
        : invoiceActions.addInvoice({ invoice })
    );

    this.resetFormAndClose();
    this.formSubmitted = false;
  }

  public saveAsDraft(): void {
    this.handleFormSubmission(true);
  }

  public sendInvoice(): void {
    this.handleFormSubmission(false);
  }

  public addItem(): void {
    this.items.push(this.createItem());
    this.updateFormTotal();
  }

  public removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateFormTotal();
  }

  public hasValidationError(controlName: string, errorName: string): boolean {
    const control = this.invoiceCreationForm.get(controlName);
    return (this.formSubmitted && control?.hasError(errorName)) ?? false;
  }

  public submitForm(): void {
    console.log(this.invoiceCreationForm.value);
  }

  public updateItemTotal(index: number): void {
    const item = this.items.at(index);
    this.updateItemAndFormTotal(item);
  }

  public discardChanges(): void {
    if (this.formIsEditing()) {
      this.fillForm(this.selectedInvoiceCopy);
      this.storeService.dispatch(interactionsActions.closeForm());
    } else {
      this.resetFormAndClose();
    }
  }
}
