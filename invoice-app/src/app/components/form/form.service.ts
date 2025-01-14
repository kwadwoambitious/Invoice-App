import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

Injectable({
  providedIn: 'root',
});

export class FormService {
  private readonly fb = inject(FormBuilder);
  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required]],
      total: [{ value: 0, disabled: true }],
    });
  }

  generateId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

    return `${randomLetters}${randomDigits}`;
  }
}
