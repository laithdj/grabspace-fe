import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  constructor(/*private auth:AuthService*/
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private route: Router,
    private datePipe: DatePipe,
    private forBuilder: FormBuilder) { this.vendorsdata = 0, this.success = false, this.payment = true, this.offerservice = 0, this.time = [], this.daysDisabled = [], this.Times = [] }



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

    this.bookingForm = this.forBuilder.group({
      time: [null, [Validators.required]],
      First_name: [null, [Validators.required]],
      Last_name: [null, [Validators.required]],
      Number: [null, [Validators.required]],
      mail: [null, [Validators.required]],
      REGO: [null],
      Identity_no: [null],
      payment_option: [null, [Validators.required]],
      user_address: [null, [Validators.required]],
      payment_card_name: [null],
      payment_card_number: [null],
      payment_card_expiration: [null],
      payment_card_cvv: [null],
    })
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






}