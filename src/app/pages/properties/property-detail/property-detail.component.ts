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
    if (days >= 0) {
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
    csvContent += `"Title","${this.details.title}"\n`;
    csvContent += `"City","${this.details.city?.name || '-'}"\n`;
    csvContent += `"Address","${this.details.address || '-'}"\n`;
    csvContent += `"Description","${this.details.description || '-'}"\n`;
    csvContent += `"Space Type","${this.details.spaceType || '-'}"\n`;
    const adShowPerTime = this.details.spaceType === 'Digital' && this.details.adShowPerTime ? this.details.adShowPerTime : '-';
    csvContent += `"How long will ad show per time?	","${adShowPerTime}"\n`;
    csvContent += `"Space","${this.details.space || '-'}"\n`;
    csvContent += `"Size (Width x Height)	","${this.details.sizeWidth || '0'} x ${this.details.sizeHeight || '0'}"\n`;
    csvContent += `"Rent Price","${this.details.rentPrice || '-'}"\n`;
    csvContent += `"Including print and install?","${this.details.includePrintInstall ? 'Yes' : 'No'}"\n`;
    csvContent += `"Traffic?","${this.details.traffic ? 'Yes' : 'No'}"\n`;
    const viewersPerDay = this.details.traffic && this.details.viewersPerDay ? this.details.viewersPerDay : '-';
    csvContent += `"How many viewers per day?","${viewersPerDay}"\n`;
    csvContent += `"Seller Full Name","${this.details.sellerName}"\n`;
    csvContent += `"Seller Email","${this.details.sellerEmail}"\n`;
    csvContent += `"Seller Contact Number","(+) ${this.details.sellerNumber}"\n`;
    csvContent += `"Seller Address","${this.details.sellerAddress}"\n`;
    const a = document.createElement('a');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'listing-csv.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    setTimeout(() => {
      this.csvLoading = false;  
    }, 1000);

  }

}
