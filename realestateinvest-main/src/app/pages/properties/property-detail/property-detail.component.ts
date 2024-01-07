import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route } from '@angular/router';
import { PropertyService } from '@pages/profile/services/property/property.service';
import { backendurl } from 'src/environments/environment';
import * as moment from 'moment';

declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit, AfterViewInit {

  details: any = {};
  latestProperties: any = [];
  id: string;
  csvLoading: boolean
  backendurl = backendurl;
  swiperSliderMain = null;
  swiperSliderThumb = null;
  constructor(
    private propertyService: PropertyService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe((param: any) => {
      this.details = {};
      if (param.id) {
        this.id = param.id;
        this.getPropertyDetail(param.id);
        this.getLatestProperties(param.id);
      }
    })
  }
  ngAfterViewInit() {
    this.increasePropertyCount()
  }
  ngOnDestroy() {
    if (this.swiperSliderMain) {
      this.swiperSliderMain.destroy();
    }
    if (this.swiperSliderThumb) {
      this.swiperSliderThumb.destroy();
    }
  }
  loadSlider() {
    this.swiperSliderMain = new Swiper(".featured-thum-slider2", {
      spaceBetween: 5,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      loop: false,
      breakpoints: {
        0: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 5,
        },
      },
    });

    this.swiperSliderThumb = new Swiper(".feature-box3", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      loop: false,
      autoplay: {
        delay: 5000,
      },
      thumbs: {
        swiper: this.swiperSliderMain,
      },
    });
    /*----------------------------- Product Image Zoom --------------------------------*/
    $('.zoom-image-hover').zoom();
  }
  increasePropertyCount() {
    if (!this.id) {
      return;
    }
    this.propertyService.updatePropertyCount(this.id).subscribe(
      (updateCountRes) => {
        console.log('updateCountRes', updateCountRes);
      },
      (updateCountErr) => {
        console.error('updateCountErr', updateCountErr);
      }
    );
  }
  getPropertyDetail(propertyId: string) {
    this.details = {};
    this.propertyService.getPropertiesById(propertyId).subscribe(
      (propRes) => {
        console.log('propRes', propRes);
        this.details = propRes;
        this.details.timeLong = this.getPostedTimeline(propRes.createdAt);
        setTimeout(() => {
          this.loadSlider();
        }, 1000);

      },
      (propErr) => {
        console.error('propErr', propErr);
        this.details = {};
      }
    );
  }
  getPostedTimeline(createdDate): string {
    const years = moment().diff(createdDate, 'years');
    if (years > 0) {
      return `${years} years old`;
    }
    const months = moment().diff(createdDate, 'months');
    if (months > 0) {
      return `${months} months old`;
    }
    const days = moment().diff(createdDate, 'days');
    if (days > 0) {
      return `${days} days old`;
    }
    return ``;
  }
  getLatestProperties(propertyId: string) {
    this.latestProperties = [];
    this.propertyService.getLatestProperties(propertyId).subscribe(
      (propRes) => {
        console.log('propRes', propRes);
        this.latestProperties = propRes;
      },
      (propErr) => {
        console.error('propErr', propErr);
        this.latestProperties = [];
      }
    );
  }
  onPrintPage() {
    // const printContent = document.getElementById("single-page-detail");
    // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write(printContent.innerHTML);
    // WindowPrt.document.close();
    // WindowPrt.focus();
    window.print();
    // WindowPrt.close();
  }
  onDownloadCSV() {
    console.log('this.details', this.details);
    // return;
    this.csvLoading = true;
    let csvContent = ``;
    csvContent += `"Name","${this.details.title}"\n`;
    csvContent += `"Type","${this.details.propertyType?.type || '-'}"\n`;
    csvContent += `"City","${this.details.city?.name || '-'}"\n`;
    csvContent += `"Area","${this.details.areaName || '-'}"\n`;
    csvContent += `"Address","${this.details.address || '-'}"\n`;
    csvContent += `"Description","${this.details.description || '-'}"\n`;
    csvContent += `"Bedrooms","${this.details.bedrooms || '-'}"\n`;
    csvContent += `"Bathrooms","${this.details.bathrooms || '-'}"\n`;
    csvContent += `"Property Age","${this.details.propertyAge || '-'}"\n`;
    csvContent += `"Land Size (In sqft.)","${this.details.landSize || '-'}"\n`;
    csvContent += `"Area (In sqft.)","${this.details.area || '-'}"\n`;
    const salePrice = this.details.hideSalePrice ? 'Contact Agent' : this.details.salePrice;
    csvContent += `"Sale Price","${salePrice}"\n`;
    csvContent += `"Rent Yeild","${this.details.rentYield || '-'}"\n`;
    csvContent += `"Weekly Current Rent","${this.details.weeklyCurrentRent || '-'}"\n`;
    csvContent += `"Weekly Rental Appraisal","${this.details.weeeklyRentalAppraisal || '-'}"\n`;
    csvContent += `"Property Value Growth (%)","${this.details.propertyValueGrowth || '-'}"\n`;
    csvContent += `"Rental Market Price","${this.details.rentalMarketPrice || '-'}"\n`;
    csvContent += `"Vacancy Rate","${this.details.vacancyRate || '-'}"\n`;
    csvContent += `"Parking Available?","${this.details.parkingAvailable ? 'Yes' : 'No'}"\n`;
    csvContent += `"Currently Tenanted?","${this.details.currentlyTenanted ? 'Yes' : 'No'}"\n`;
    csvContent += `"Is Flood Zone?","${this.details.floodZone ? 'Yes' : 'No'}"\n`;
    csvContent += `"Is Fire Zone?","${this.details.fireZone ? 'Yes' : 'No'}"\n`;
    csvContent += `"Is Land DA Approved?","${this.details.landDAApproved ? 'Yes' : 'No'}"\n`;
    csvContent += `"Is Body Corporate?","${this.details.isBodyCorporate ? 'Yes' : 'No'}"\n`;
    csvContent += `"Body Corporate Value?","${this.details.bodyCorporateValue || '-'}"\n`;
    let amenities = '-';
    if (this.details.amenities?.length) {
      amenities = this.details.amenities.map(obj => obj.name).join(',')
    }
    csvContent += `"Features & Amenities","${amenities}"\n`;
    csvContent += `"Seller Full Name","${this.details.sellerName}"\n`;
    csvContent += `"Seller Email","${this.details.sellerEmail}"\n`;
    csvContent += `"Seller Contact Number","(+) ${this.details.sellerNumber}"\n`;
    csvContent += `"Seller Address","${this.details.sellerAddress}"\n`;
    const a = document.createElement('a');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'property-csv.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setTimeout(() => {
      this.csvLoading = false;  
    }, 1000);

  }

}
