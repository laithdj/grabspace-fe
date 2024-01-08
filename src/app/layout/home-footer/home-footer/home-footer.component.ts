import { Component, OnInit } from '@angular/core';
import { RoutingService } from '@services/routing/routing.service';

import { Subscription } from 'rxjs/index';
const subscriberList: Array<Subscription> = []

@Component({
  selector: 'app-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

  isHomePage: boolean = false;

  constructor(
    private routing: RoutingService,
  ) { }

  ngOnInit(): void {
    subscriberList.push(
      this.routing.$currentPage.subscribe(currentPage => {
        this.isHomePage = false;
        if (['/', '/home', '/contact'].indexOf(currentPage) > -1) {
          this.isHomePage = true;
        }
      })
    );
  }
  ngOnDestroy(): void {
    subscriberList.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    })
  }

}
