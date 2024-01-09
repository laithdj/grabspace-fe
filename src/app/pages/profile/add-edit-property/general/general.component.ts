import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { PropertyService } from '../../services/property/property.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  propertyForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  propertyTypes = [];
  propertyStatusList = [];
  cityList = [];

  constructor(
    private router: Router,
    private propertyService: PropertyService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.setupFormData();
    this.errors = {};
    this.getCityList();
  }
  setupFormData() {
    const generalDetails = this.propertyService.getFormValue().general;
    this.propertyForm = this.initialFormValues(generalDetails);
  }
  initialFormValues(generalValues: any) {
    return {
      title: generalValues?.title || '',
      city: generalValues?.city || null,
      address: generalValues?.address || '',
      description: generalValues?.description || '',
    }
  }

  getCityList(): void {
    this.propertyService.getCities().subscribe(cityRes => {
      if (cityRes.length > 0) {
        this.cityList = cityRes;
      }
    })
  }

  validateGeneralForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      Object.keys(this.propertyForm).forEach(field => {
        if (!this.propertyForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitGeneral() {
    console.log('onSubmitGeneral called.');
    this.submitted = true;
    const errors = this.validateGeneralForm();
    console.log('errors', errors, this.errors);
    if (!errors) {
      this.submitLoading = true;
      this.propertyService.setFormValue('GENERAL', this.propertyForm);
      setTimeout(() => {
        if (this.propertyService.updateId) {
          this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/details`);
          this.submitLoading = false;
          return;
        }
        this.router.navigateByUrl(`/profile/add-listing/details`);
        this.submitLoading = false;
      }, 1000);
    }
  }

}
