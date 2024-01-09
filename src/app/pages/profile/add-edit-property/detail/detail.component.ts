import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { PropertyService } from '../../services/property/property.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { backendurl, baseurl } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  propertyForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  spaceTypeList = [
    { id: 'Static', name: 'Static' },
    { id: 'Digital', name: 'Digital' }
  ];
  spaceList = [
    { id: 'Billboards', name: 'Billboards' },
    { id: 'Bus Stops', name: 'Bus Stops' },
    { id: 'Building wall', name: 'Building wall' },
    { id: 'Moving Vehicles', name: 'Moving Vehicles' },
  ];
  rentPricePeriodList = [
    { id: 'Per week', name: 'Per week' },
    { id: 'Per month', name: 'Per month' },
    { id: 'Per year', name: 'Per year' },
    { id: 'Per day', name: 'Per day' },
  ];

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
    const propertyDetails = this.propertyService.getFormValue().details;
    // if (this.propertyService.updateData?.id) {
    //   propertyDetails = this.propertyService.updateData;
    //   this.propertyForm = this.initialFormValues(propertyDetails);
    //   this.propertyService.setFormValue('DETAILS', this.propertyForm);
    //   return;
    // }
    this.propertyForm = this.initialFormValues(propertyDetails);
  }
  initialFormValues(detailValues: any) {
    return {
      spaceType: detailValues?.spaceType || null,
      adShowPerTime: detailValues?.adShowPerTime || null,
      space: detailValues?.space || null,
      sizeHeight: detailValues?.sizeHeight || null,
      sizeWidth: detailValues?.sizeWidth || null,
      rentPrice: detailValues?.rentPrice || null,
      rentPricePeriod: detailValues?.rentPricePeriod || null,
      includePrintInstall: detailValues?.includePrintInstall || false,
      traffic: detailValues?.traffic || false,
      viewersPerDay: detailValues?.viewersPerDay || null,
    }
  }

  validateDetailsForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      const excludeRequiredFields = ['includePrintInstall','traffic'];
      Object.keys(this.propertyForm).forEach(field => {
        if (field === 'spaceType') {
          if (!this.propertyForm.spaceType || this.propertyForm.spaceType != 'Digital') {
            excludeRequiredFields.push('adShowPerTime');
          }
        }
        if (field === 'traffic' && !this.propertyForm.traffic) {
          excludeRequiredFields.push('viewersPerDay');
        }
        if (excludeRequiredFields.indexOf(field) > -1) {
          return;
        }
        if (!this.propertyForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitDetails() {
    console.log('onSubmitDetails called.');
    this.submitted = true;
    const errors = this.validateDetailsForm();
    console.log('errors', errors, this.errors);
    if (!errors) {
      this.submitLoading = true;
      this.propertyService.setFormValue('DETAILS', this.propertyForm);
      setTimeout(() => {
        if (this.propertyService.updateId) {
          this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/images`);
          this.submitLoading = false;
          return;  
        }
        this.router.navigateByUrl(`/profile/add-listing/images`);
        this.submitLoading = false;
      }, 1000);
    }
  }

  onPreviousPage(): void {
    if (this.propertyService.updateId) {
      this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/general`);
      return;
    }
    this.router.navigateByUrl(`/profile/add-listing/general`);
  }

}
