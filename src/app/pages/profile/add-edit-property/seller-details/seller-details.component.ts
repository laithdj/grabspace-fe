import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { PropertyService } from '../../services/property/property.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.scss']
})
export class SellerDetailsComponent implements OnInit {

  propertyForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.setupFormData();
    this.errors = {};
  }
  setupFormData() {
    const existingSellerDetails = this.propertyService.getFormValue().sellerDetails;
    // if (this.propertyService.updateData?.id) {
    //   existingSellerDetails = this.propertyService.updateData;
    //   this.propertyForm = this.initialFormValues(existingSellerDetails);
    //   this.propertyService.setFormValue('SELLER_DETAILS', this.propertyForm);
    //   return;
    // }
    this.propertyForm = this.initialFormValues(existingSellerDetails);
  }
  initialFormValues(sellerValues: any) {
    return {
      sellerName: sellerValues?.sellerName || '',
      sellerEmail: sellerValues?.sellerEmail || '',
      sellerNumber: sellerValues?.sellerNumber || '',
      sellerAddress: sellerValues?.sellerAddress || '',
    }
  }
  validateSellerDetailsForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      Object.keys(this.propertyForm).forEach(field => {
        if (['sellerAddress'].indexOf(field) > -1) {
          return;
        }
        if (!this.propertyForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitSellerDetails() {
    console.log('onSubmitSellerDetails called.');
    this.submitted = true;
    const errors = this.validateSellerDetailsForm();
    console.log('errors', errors, this.errors);
    if (!errors) {
      this.submitLoading = true;
      this.propertyService.setFormValue('SELLER_DETAILS', this.propertyForm);
      if (this.propertyService.updateId && this.propertyService.updateData?.id) {
        this.editListing(this.propertyService.updateData.id);
        return;
      }
      this.addListing();
      // setTimeout(() => {
      //   this.submitLoading = false;
      // }, 1000);
    }
  }
  addListing(): void {
    this.propertyService.createProperty().subscribe(
      (createRes: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Listing added.' });
        setTimeout(() => {
          this.router.navigateByUrl(`/profile/my-listing`);
          this.resetPropertyForm();
          this.submitLoading = false;
        }, 1000);
      },
      (createErr: any) => {
        if (createErr.error?.message) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: createErr.error?.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ERROR_MESSAGES.SOMETHING_WRONG });
        }
        this.submitLoading = false;
      }
    )
  }
  editListing(listingId): void {
    this.propertyService.updateProperty(listingId).subscribe(
      (createRes: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Listing updated.' });
        setTimeout(() => {
          this.router.navigateByUrl(`/profile/my-listing`);
          this.resetPropertyForm();
          this.submitLoading = false;
        }, 1000);
      },
      (createErr: any) => {
        if (createErr.error?.message) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: createErr.error?.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ERROR_MESSAGES.SOMETHING_WRONG });
        }
        this.submitLoading = false;
      }
    )
  }
  resetPropertyForm() {
    this.submitted = false;
    this.errors = {};
    this.propertyForm = this.initialFormValues({});
    this.propertyService.resetPropertyForm();
  }

  onPreviousPage(): void {
    if (this.propertyService.updateId) {
      this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/images`);
      return;
    }
    this.router.navigateByUrl(`/profile/add-listing/images`);
  }

}
