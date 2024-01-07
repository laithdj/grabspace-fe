import { ElementRef, Inject, Injectable, ViewChild } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  $currentPage = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show progress spinner or progress bar
        console.log('Route change detected', event.url);
        const noSpinnerRoutes = [
          `/profile/add-property/general`,
          `/profile/add-property/images`,
          `/profile/add-property/details`,
          `/profile/add-property/seller-details`,
        ]
        const routeInclude = event.url.includes('profile/edit-property');
        console.log('routeInclude', routeInclude);
        if (noSpinnerRoutes.indexOf(event.url) === -1 && !routeInclude) {
          this.startPreLoader();  
        }
        
      }

      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        // this.currentRoute = event.url;
        this.$currentPage.next(event.url);
        setTimeout(() => {
          this.stopPreLoader();
        }, 500);
      }

      // if (event instanceof NavigationError) {
      //   // Hide progress spinner or progress bar

      //   // Present error to user
      //   console.log(event.error);
      // }
    });
  }

  getCurrentRoute() {
    return this.router.url;
  }

  stopPreLoader(): void {
    // Page Preloader
    let preloader = $("#preloader");
    if (preloader) {
      $("#preloader").fadeOut("slow", () => {
        $(this).remove();
      });
    }
  }
  startPreLoader(): void {
    $("#preloader").show();
  }
}
