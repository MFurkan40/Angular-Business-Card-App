import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CardService } from 'src/app/services/card.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent implements OnInit {
  cardForm!: FormGroup;
  showSpinner: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.cardForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.maxLength(255)],
      ],
      name: [this.data?.name || '', Validators.maxLength(50)],
      phone: [
        this.data?.phone || '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^0\d{3}\s\d{3}\s\d{2}\s\d{2}$/),
        ],
      ],
      email: [
        this.data?.email || '',
        [Validators.email, Validators.maxLength(50)],
      ],
      address: [this.data?.address || '', Validators.maxLength(255)],
    });
  }

  addCard(): void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value).subscribe(
      (res: any) => {
        this.getSuccess(res || 'Business card added successfully.');
      },
      (err: any) => {
        console.log(err);
        this.getError(err.error.message || 'Error adding your business card.');
      }
    );
  }

  updateCard(): void {
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value, this.data.id).subscribe(
      (res: any) => {
        console.log(res);
        this.getSuccess(res || 'Business card updated successfully.');
      },
      (err: any) => {
        console.log(err);
        this.getError(
          err.error.message || 'Error updating your business card.'
        );
      }
    );
  }

  deleteCard(): void {
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id).subscribe(
      (res: any) => {
        console.log(res);
        this.getSuccess(res || 'Business card deleted successfully.');
      },
      (err: any) => {
        console.log(err);
        this.getError(
          err.error.message || 'Error deleting your business card.'
        );
      }
    );
  }

  getSuccess(message: string): void {
    this.snackbarService.createSnackBar('success', message);
    this.cardService.getCards();
    this.showSpinner = false;
    this.dialogRef.close(true);
  }

  getError(message: string): void {
    this.snackbarService.createSnackBar('error', message);
    this.showSpinner = false;
  }
}
