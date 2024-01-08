import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { PropertyService } from '../../services/property/property.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { backendurl } from 'src/environments/environment';

@Component({
  selector: 'app-property-images',
  templateUrl: './property-images.component.html',
  styleUrls: ['./property-images.component.scss']
})
export class PropertyImagesComponent implements OnInit {

  submitted: boolean;
  submitLoading: boolean;
  uploadLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  previewImages = [];
  propertyImages = [];
  selectedFile: File;

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
    const existingImages = this.propertyService.getFormValue().images;
    this.renderPreviousFiles(existingImages);
  }
  async renderPreviousFiles(existingImage) {
    if (!Array.isArray(existingImage)) {
      return;
    }
    if (existingImage.length <= 0) {
      return;
    }
    if (this.propertyService.updateId) {
      console.log('existingImage', existingImage);
      for (const existingImageValue of existingImage) {
        if (!existingImageValue._id) {
          const filePushData = await this.getRenderFileData(existingImageValue);
          this.previewImages.push({
            id: filePushData.id,
            image: filePushData.image
          });
          continue;
        }
        this.previewImages.push({
          id: Date.now(),
          image: `${backendurl}/${existingImageValue.path}`
        });
      }
      this.propertyImages = existingImage;
      return;
    }
    this.propertyImages = existingImage;
    for (const existingImageValue of existingImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages.push({
          id: existingImageValue.id,
          image: e.target.result
        });
      };
      reader.readAsDataURL(existingImageValue);
    }

  }
  getRenderFileData(existingImageValue): Promise<{id: any, image: string }> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve({
          id: existingImageValue.id,
          image: e.target.result
        });
      };
      reader.readAsDataURL(existingImageValue);
    })
  }
  onChangeFile(event: any) {
    if (event.target?.files?.length) {
      this.selectedFile = event.target?.files[0];
    } else {
      this.selectedFile = null;
    }

  }
  onUploadFile(): void {
    console.log('onUploadFile called');
    if (!this.selectedFile) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please select file` });
      return;
    }
    this.uploadLoading = true;
    var fileExt = this.selectedFile.name.split('.').pop();
    if (['jpg', 'jpeg', 'png'].indexOf(fileExt) <= -1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please upload only image file` });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImages.unshift({
        id: Date.now(),
        image: e.target.result
      });
      this.propertyImages.unshift(Object.assign(this.selectedFile, { id: Date.now() }));
      setTimeout(() => {
        this.uploadLoading = false;
      }, 1000);
    };
    reader.readAsDataURL(this.selectedFile);
  }
  onRemoveImage(imageData: any, imageIndex: number) {
    console.log('onRemoveImage called.', imageIndex);
    this.previewImages.splice(imageIndex, 1);
    this.propertyImages.splice(imageIndex, 1);
  }
  onSubmitImages() {
    console.log('onSubmitImages called.');
    if (this.propertyImages?.length <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please select any one image to continue` });
      return;
    }
    this.submitted = true;
    this.submitLoading = true;
    console.log('this.propertyImages', this.propertyImages);
    this.propertyService.setFormValue('IMAGES', this.propertyImages);
    const propertyFormNewValue = this.propertyService.getFormValue();
    console.log('propertyFormNewValue.images', propertyFormNewValue.images);
    setTimeout(() => {
      if (this.propertyService.updateId) {
        this.router.navigateByUrl(`/profile/edit-property/${this.propertyService.updateId}/seller-details`);
        this.submitLoading = false;
        return;
      }
      this.router.navigateByUrl(`/profile/add-property/seller-details`);
      this.submitLoading = false;
    }, 1000);
  }

  onPreviousPage(): void {
    if (this.propertyService.updateId) {
      this.router.navigateByUrl(`/profile/edit-property/${this.propertyService.updateId}/details`);
      return;
    }
    this.router.navigateByUrl(`/profile/add-property/details`);
  }

}
