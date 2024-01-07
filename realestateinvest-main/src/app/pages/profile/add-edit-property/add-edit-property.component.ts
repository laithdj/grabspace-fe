import { Component, OnInit } from '@angular/core';
import { PropertyForm } from 'src/app/core/interfaces/property-form';
import { MenuItem, MessageService } from 'primeng/api';
import { PropertyService } from '../services/property/property.service';
import { ActivatedRoute, Params } from '@angular/router';
import { backendurl } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-property',
  templateUrl: './add-edit-property.component.html',
  styleUrls: ['./add-edit-property.component.scss']
})
export class AddEditPropertyComponent implements OnInit {

  propertyForm = {} as PropertyForm;
  errors: any = {};
  items: MenuItem[];
  nowShowBody: boolean;


  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      console.log('------ROUTE CHANGE CALLLED>... =---------');
      this.propertyService.resetPropertyForm();
      if (params?.id) {
        this.getPropertyDetailsById(params.id);
      } else {
        this.propertyService.updateId = null;
        this.propertyService.updateData = {};
        this.nowShowBody = true;
      }
    })
    this.items = [
      {
        label: 'General',
        routerLink: 'general',
      },
      {
        label: 'Details',
        routerLink: 'details',
      },
      {
        label: 'Images',
        routerLink: 'images',
      },
      {
        label: 'Seller Details',
        routerLink: 'seller-details',
      },
    ];
  }
  getPropertyDetailsById(propertyId: string) {
    this.propertyService.getPropertiesByIdEdit(propertyId).subscribe(
      (propRes) => {
        console.log('propRes', propRes);
        if (propRes?.id) {
          this.propertyService.updateId = propRes.id;
          this.propertyService.updateData = propRes;
          const generalDetails = {
            type: propRes.propertyType,
            title: propRes.title,
            areaName: propRes.areaName,
            city: propRes.city,
            address: propRes.address,
            description: propRes.description,
            propertyStatus: propRes.propertyStatus,
          }
          this.propertyService.setFormValue('GENERAL', generalDetails);
          const propertyDetais = {
            bedrooms: propRes.bedrooms || null,
            bathrooms: propRes.bathrooms || null,
            propertyAge: propRes.propertyAge || null,
            landSize: propRes.landSize || '',
            area: propRes.area || '',
            salePrice: propRes.salePrice || null,
            rentYield: propRes.rentYield || null,
            weeklyCurrentRent: propRes.weeklyCurrentRent || null,
            weeeklyRentalAppraisal: propRes.weeeklyRentalAppraisal || null,
            propertyValueGrowth: propRes.propertyValueGrowth || null,
            rentalMarketPrice: propRes.rentalMarketPrice || null,
            vacancyRate: propRes.vacancyRate || null,
            hideSalePrice: propRes.hideSalePrice || false,
            parkingAvailable: propRes.parkingAvailable || false,
            currentlyTenanted: propRes.currentlyTenanted || false,
            fireZone: propRes.fireZone || false,
            floodZone: propRes.floodZone || false,
            landDAApproved: propRes.landDAApproved || false,
            isBodyCorporate: propRes.isBodyCorporate || false,
            bodyCorporateValue: propRes.bodyCorporateValue || null,
            amenities: propRes.amenities || [],
            floorPlans: [],
          }
          if (propRes.floorPlans?.length > 0) {
            propertyDetais.floorPlans = [];
            for (const dbFloorValue of propRes.floorPlans) {
              const floorValueObj = {
                title: dbFloorValue.title,
                image: null,
                imageSrc: dbFloorValue.imageName ? `${ backendurl }/${dbFloorValue.path}` : '',
                _id: dbFloorValue._id
              }
              propertyDetais.floorPlans.push(floorValueObj);
            }
          }
          this.propertyService.setFormValue('DETAILS', propertyDetais);
          const propertyImages = propRes.images?.length ? propRes.images : [];
          this.propertyService.setFormValue('IMAGES', propertyImages);
          const sellerDetails = {
            sellerName: propRes.sellerName || '',
            sellerEmail: propRes.sellerEmail || '',
            sellerNumber: propRes.sellerNumber || '',
            sellerAddress: propRes.sellerAddress || '',
          };
          this.propertyService.setFormValue('SELLER_DETAILS', sellerDetails);
        }
        this.nowShowBody = true;
      },
      (propErr: any) => {
        console.error('propErr', propErr);
        this.nowShowBody = true;
      }
    )
  }
  onActiveIndexChange(event: number) {
    console.log('onActiveIndexChange called.', event);
  }

}
