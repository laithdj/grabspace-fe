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
    this.getPropertyTypesList();
    this.getPropertyStatusList();
    this.getCityList();
  }
  setupFormData() {
    const generalDetails = this.propertyService.getFormValue().general;
    // if (!this.propertyService.updateData?.id) {
    //   generalDetails = this.propertyService.updateData;
    //   generalDetails.type = generalDetails.propertyType;
    //   this.propertyForm = this.initialFormValues(generalDetails);
    //   this.propertyService.setFormValue('GENERAL', this.propertyForm);
    //   return;
    // }
    this.propertyForm = this.initialFormValues(generalDetails);
  }
  initialFormValues(generalValues: any) {
    return {
      type: generalValues?.type || null,
      title: generalValues?.title || '',
      areaName: generalValues?.areaName || '',
      city: generalValues?.city || null,
      address: generalValues?.address || '',
      description: generalValues?.description || '',
      propertyStatus: generalValues?.propertyStatus || null,
    }
  }

  getPropertyTypesList(): void {
    this.propertyService.getPropertyTypes().subscribe(typeRes => {
      if (typeRes.length > 0) {
        this.propertyTypes = typeRes;
      }
    })
  }
  getPropertyStatusList(): void {
    this.propertyService.getPropertyStatus().subscribe(statusRes => {
      if (statusRes.length > 0) {
        this.propertyStatusList = statusRes;
      }
    })
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
        if (['propertyStatus'].indexOf(field) > -1) {
          return;
        }
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
    console.log('errors', errors);
    if (!errors) {
      this.submitLoading = true;
      this.propertyService.setFormValue('GENERAL', this.propertyForm);
      const propertyFormNewValue = this.propertyService.getFormValue();
      console.log('propertyFormNewValue.general', propertyFormNewValue.general);
      setTimeout(() => {
        if (this.propertyService.updateId) {
          this.router.navigateByUrl(`/profile/edit-property/${this.propertyService.updateId}/details`);
          this.submitLoading = false;
          return;
        }
        this.router.navigateByUrl(`/profile/add-property/details`);
        this.submitLoading = false;
      }, 1000);
    }
  }

}
