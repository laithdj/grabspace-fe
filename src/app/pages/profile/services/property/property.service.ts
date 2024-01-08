import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { baseurl } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  propertyForm = {
    general: {} as any,
    details: {} as any,
    images: {} as any,
    sellerDetails: {} as any,
  };
  updateId: string;
  updateData = {} as any;

  constructor(
    private http: HttpClient
  ) { }

  setFormValue(formType: 'GENERAL' | 'DETAILS' | 'IMAGES' | 'SELLER_DETAILS', formValues: any) {
    console.log('formType', formType);
    console.log('formValues', formValues);
    switch (formType) {
      case 'GENERAL':
        this.propertyForm.general = formValues;
        break;
      case 'DETAILS':
        this.propertyForm.details = formValues;
        break;
      case 'IMAGES':
        this.propertyForm.images = formValues;
        break;
      case 'SELLER_DETAILS':
        this.propertyForm.sellerDetails = formValues;
        break;
      default:
        break;
    }
  }
  getFormValue() {
    return this.propertyForm;
  }
  resetPropertyForm() {
    this.propertyForm = {
      general: {} as any,
      details: {} as any,
      images: {} as any,
      sellerDetails: {} as any,
    };
  }

  getPropertyTypes(): any {
    return this.http.get(`${baseurl}/property/types`);
  }
  getPropertyStatus(): any {
    return this.http.get(`${baseurl}/property/status`);
  }
  getAmenities(): any {
    return this.http.get(`${baseurl}/property/amenities`);
  }
  getCities(): any {
    return this.http.get(`${baseurl}/property/cities`);
  }
  createProperty(): any {
    const propertyData = this.propertyForm;
    console.log('propertyData', propertyData);
    const formData: any = new FormData();
    if (propertyData.images?.length > 0) {
      for (const imageValue of propertyData.images) {
        if (!imageValue?.name) {
          continue;
        }
        formData.append("images", imageValue, imageValue.name);
      }
    }
    if (propertyData.details.floorPlans?.length) {
      for (const floorPlanValue of propertyData.details.floorPlans) {
        if (!floorPlanValue.image?.name) {
          continue;
        }
        delete floorPlanValue.imageSrc;
        formData.append("floorPlanImages", floorPlanValue.image, floorPlanValue.image.name);
      }
    }
    formData.append('propertyData', JSON.stringify(propertyData));
    return this.http.post(`${baseurl}/property`, formData);
  }
  updateProperty(propertyId: string): any {
    const propertyData = this.propertyForm;
    console.log('propertyData', propertyData);
    const formData: any = new FormData();
    if (propertyData.images?.length > 0) {
      for (const imageValue of propertyData.images) {
        if (!imageValue?.name) {
          continue;
        }
        formData.append("images", imageValue, imageValue.name);
      }
    }
    if (propertyData.details.floorPlans?.length) {
      for (const floorPlanValue of propertyData.details.floorPlans) {
        if (!floorPlanValue.image?.name) {
          continue;
        }
        delete floorPlanValue.imageSrc;
        formData.append("floorPlanImages", floorPlanValue.image, `${floorPlanValue.image.name}`);
      }
    }
    formData.append('propertyData', JSON.stringify(propertyData));
    return this.http.put(`${baseurl}/property/${propertyId}`, formData);
  }
  getUserProperties(): any {
    return this.http.get(`${baseurl}/property/user-properties`);
  }
  deleteProperty(propertyId: string): any {
    return this.http.delete(`${baseurl}/property/${propertyId}`);
  }
  getPropertiesById(propertyId: string): any {
    return this.http.get(`${baseurl}/property/${propertyId}`);
  }
  updatePropertyCount(propertyId: string): any {
    return this.http.put(`${baseurl}/property/update-count`, { propertyId });
  }
  getPropertyCsv(propertyId: string): any {
    return this.http.post(`${baseurl}/property/get-property-csv`, { propertyId });
  }
  getPropertiesByIdEdit(propertyId: string): any {
    return this.http.get(`${baseurl}/property/edit-view/${propertyId}`);
  }
  getLatestProperties(propertyId: string): any {
    return this.http.get(`${baseurl}/property/latest-properties?id=${propertyId}`);
  }
  getProperties(filters: any): any {
    return this.http.post(`${baseurl}/property/properties`, filters);
  }
}
