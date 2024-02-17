import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as CONSTANTS from 'src/app/core/constants';
import { MessageService } from 'primeng/api';
import { backendurl } from 'src/environments/environment';
import { PropertyService } from '@pages/profile/services/property/property.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  @ViewChild('search')
  public searchElementRef: ElementRef;

  selected: any = null;
  date: Date[];
  minDate: Date = new Date();
  selectedTimeOnCondition: any = "";
  offerservice: any;
  paymentHandler: any = null;
  loader = false;
  isLocation = false;

  loggedUser: any;
  vendorsdata: any;
  freeSlots: any;
  selectedData: any;
  success: boolean;
  failure: boolean;
  bookingForm: FormGroup;
  email: boolean = true;
  time: any;
  latitude: number;
  longitude: number;
  zoom: number;
  outputLocation: any;

  address: string;
  daysDisabled: Array<Number>;

  minTime: string;
  maxTime: string;
  times = [
    { id: '8:00', name: '8:00 AM' },
    { id: '9:00', name: '9:00 AM' },
    { id: '10:00', name: '10:00 AM' },
    { id: '11:00', name: '11:00 AM' },
    { id: '12:00', name: '12:00 PM' },
    { id: '13:00', name: '1:00 PM' },
    { id: '14:00', name: '2:00 PM' },
    { id: '15:00', name: '3:00 PM' },
  ];
  payment: any;
  disabledDates: Date[];
  Times: any;
  dateArray: Date[];
  blockedTime: boolean;

  submitted: boolean;
  submitLoading: boolean;
  uploadLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  previewImages = [];
  propertyImages = [];
  selectedFile: File;


  constructor(/*private auth:AuthService*/
    private activatedRoute: ActivatedRoute,
    private propertyService: PropertyService,
    private router: Router,

    private messageService: MessageService) { this.vendorsdata = 0, this.success = false, this.payment = true, this.offerservice = 0, this.time = [], this.daysDisabled = [], this.Times = [] }



  ngOnInit(): void {
    this.outputLocation = null;
    this.map();


    this.minDate.setDate(this.minDate.getDate() + 3);
    // const vendid = this.activatedRoute.snapshot.paramMap.get('vendid');
    // const serid = this.activatedRoute.snapshot.paramMap.get('serviceid');
    this.selectedData = {
      // "user_id":this.activatedRoute.snapshot.paramMap.get('user_id'),
      "service_id": this.activatedRoute.snapshot.paramMap.get('service_id'),
      "vendor_id": this.activatedRoute.snapshot.paramMap.get('user_id'),
      "pet_id": this.activatedRoute.snapshot.paramMap.get('pet_id'),
      "pet_name": this.activatedRoute.snapshot.paramMap.get('pet_name'),
      "breed_id": this.activatedRoute.snapshot.paramMap.get('breed_id'),
      "breed_name": this.activatedRoute.snapshot.paramMap.get('breed_name'),
      "address": this.activatedRoute.snapshot.paramMap.get('address'),
      "latitude": this.activatedRoute.snapshot.paramMap.get('latitude'),
      "longitude": this.activatedRoute.snapshot.paramMap.get('longitude'),

    }


    // this.loggedUser = this.auth.getUser().value;
    this.invokeStripe();
  }


  ch() {
    this.payment = false;
  }

  load(date?: any) {
    this.selected = date;

    // if (!this.daysDisabled.includes(this.selected?.getDay())) {
    //   // alert("vendor not available at this day! Check freeslots");
    // //  this.toastr.error("Clinic not open on this day! Check opening hours below");
    //   this.selected = null;
    // }
    // else {
    //   this.Times.forEach((el: any) => {
    //     if (this.selected?.getDay() == el.value) {
    //       this.minTime = el.Start_Time;
    //       this.maxTime = el.End_Time;

    //       //       const starttime = moment(this.minTime, 'HH:mm');
    //       // const endtime = moment(this.maxTime, 'HH:mm');




    //     }
    //   })
    // }
  }





  map() {
    // this.mapsAPILoader.load().then(() => {
    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;

    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });



  
  }



  changeSearch(e: any) {
    this.isLocation = false;

  }


  closedofficeDates() {

    this.disabledDates = [];


    for (let zi = 0; zi < 7; zi++) {

      let indx = this.daysDisabled.findIndex((x) => x === zi);
      if (indx < 0) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        for (let i = 0; i < 52; i++) {
          let monday = new Date(year, month, day + (zi - date.getDay()));
          this.disabledDates.push(monday);
          day += 7; // increment day by 7 to get the next Monday
        }
      }
    }
    // loop through the next 52 weeks (1 year) and disable all Mondays

  }




  // dateFilter = (date: Date): boolean => {

  //   const day = date.getDay();
  //   console.log(day);
  //   return this.daysDisabled.includes(day);

  // }

  //   invokeStripe(){
  //     if(!window.document.getElementById('stripe-script')){
  //       const script = window.document.createElement('script');
  //       script.id = 'stripe-script';
  //         script.type = 'text/javascript';
  //         script.src = 'https://checkout.stripe.com/checkout.js';
  //         script.onload = () => {
  //           this.paymentHandler = (<any>window).StripeCheckout.configure({
  //             key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
  //             locale: 'auto',
  //             token: function (stripeToken: any) {
  //               console.log('stripe Token : ',stripeToken);
  //             },
  //           });
  //         };
  //         window.document.body.appendChild(script);
  //       }
  //     }


  //   makePayment(amount: number,e:any){

  // if(e.target.checked){
  //   const paymentHandler = (<any>window).StripeCheckout.configure({
  //     key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
  //     locale: 'auto',
  //     token: function (stripeToken: any) {  // credit card info token
  //       console.log('stripeToken:',stripeToken);
  //       paymentstripe(stripeToken,amount);
  //     },
  //   });

  //   const paymentstripe = (stripeToken: any, amount:number) => {
  //     console.log('amount ', amount);
  //     this.checkout.makePayment(stripeToken,amount).subscribe((res: any) => {
  //       console.log('res :',res);
  //       if (res?.data === "success") {

  //         this.success = true
  //       }
  //       else {
  //         this.failure = true
  //       }
  //     });
  //   };

  //     paymentHandler.open({
  //       name:"Pets Service",
  //       description:"This is paws management system",
  //       amount:amount*100
  //     })
  // }
  // }



  // invokeStripe() {
  //   if (!window.document.getElementById('stripe-script')) {
  //     const script = window.document.createElement('script');
  //     script.id = 'stripe-script';
  //     script.type = 'text/javascript';
  //     script.src = 'https://checkout.stripe.com/checkout.js';
  //     script.onload = () => {
  //       this.paymentHandler = (<any>window).StripeCheckout.configure({
  //         key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
  //         locale: 'auto',
  //         token: function (stripeToken: any) {
  //           console.log('stripe Token : ',stripeToken);
  //         },
  //       });
  //     };
  //     window.document.body.appendChild(script);
  //   }
  // }

  // makePayment(amount: number, e: any) {

  //   if (e.target.checked) {
  //     const paymentHandler = (<any>window).StripeCheckout.configure({
  //       key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
  //       locale: 'auto',
  //       token: function (stripeToken: any) {
  //         console.log('stripeToken:', stripeToken);
  //         paymentstripe(stripeToken, amount);
  //       },
  //       onClose: function () {
  //         e.target.checked = false; // uncheck the checkbox
  //         this.payment=true;

  //       },
  //     });

  //     const paymentstripe = (stripeToken: any, amount: number) => {
  //       console.log('amount ', amount);
  //       this.checkout.makePayment(stripeToken, amount).subscribe((res: any) => {
  //         console.log('res :', res);
  //         if (res?.data === 'success') {
  //           this.success = true;
  //           this.payment=false;
  //         } else {
  //           this.failure = true;
  //         }
  //       });
  //     };

  //     paymentHandler.open({
  //       name: 'Pets Service',
  //       description: 'This is paws management system',
  //       amount: amount * 100,
  //       closed: function () {

  //         if(this.success==true)
  //         {

  //         }
  //         else
  //         {
  //         this.payment=true;
  //         e.target.checked = false;
  //         }
  //       },
  //     });
  //   }
  // }

  invokeStripe() {

    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.defer = true;
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log('stripe Token : ', stripeToken);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  makePayment(amount: number, e: any) {
    e.target.checked = false;
    // if (e.target.checked) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51MI6vBKctCVcz9XGYPbuOyHWGSyk3Mj1Xt9P4DG5C9g2EOtmIpeir82SvEbw4CIr11JQ2DGIWYCt3Q3ThK3gTJ8e00jR7f8hXQ',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log('stripeToken:', stripeToken);
      },
      // onClose: function () {
      //   e.target.checked = false; // uncheck the checkbox
      //   this.payment=true;

      // },
    });

  

    paymentHandler.open({
      name: 'Pets Service',
      description: 'This is paws management system',
      amount: amount * 100,


    });
    // }
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
    this.propertyService.setFormValue('IMAGES', this.propertyImages);
    setTimeout(() => {
      if (this.propertyService.updateId) {
        this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/seller-details`);
        this.submitLoading = false;
        return;
      }
      this.router.navigateByUrl(`/profile/add-listing/seller-details`);
      this.submitLoading = false;
    }, 1000);
  }

  onPreviousPage(): void {
    if (this.propertyService.updateId) {
      this.router.navigateByUrl(`/profile/edit-listing/${this.propertyService.updateId}/details`);
      return;
    }
    this.router.navigateByUrl(`/profile/add-listing/details`);
  }




}