import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '@pages/profile/services/property/property.service';

declare var $: any;
declare var TweenMax: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cityList = [];
  spaceList = [
    { id: 'Billboards', name: 'Billboards' },
    { id: 'Bus Stops', name: 'Bus Stops' },
    { id: 'Building wall', name: 'Building wall' },
    { id: 'Moving Vehicles', name: 'Moving Vehicles' },
  ];
  rentPriceList = [
    { id: 'Per week', name: 'Per week' },
    { id: 'Per month', name: 'Per month' },
    { id: 'Per year', name: 'Per year' },
    { id: 'Per day', name: 'Per day' },
  ];
  homeSearchForm = {
    title: '',
    space: null,
    city: null,
    minHeight: null,
    minWidth: null,
    priceRange: null,
    includePrintInstall: null,
  };
  showMoreFilter = false;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCityList();
  }
  ngAfterViewInit() {
    $("select").niceSelect();

    /*--------------------------------------
       Isotope initialization
       --------------------------------------*/
    var $container = $(".isotope-wrap");
    if ($container.length > 0) {
      var $isotope: any;
      $(".featuredContainer", $container).imagesLoaded(
        () => {
          $isotope = $(".featuredContainer", $container).isotope({
            filter: "*",
            transitionDuration: "1s",
            hiddenStyle: {
              opacity: 0,
              transform: "scale(0.001)",
            },
            visibleStyle: {
              transform: "scale(1)",
              opacity: 1,
            },
          });
        }
      );
      $container.find(".isotope-classes-tab").on("click", "a", function () {
        var $this = $(this);
        $this.parent(".isotope-classes-tab").find("a").removeClass("current");
        $this.addClass("current");
        var selector = $this.attr("data-filter");
        console.log('selector', selector);
        $isotope.isotope({
          filter: selector,
        });
        return false;
      });
    }
    const that = this;
    $('body').on('mousemove', '.motion-effects-wrap', function (e) {
      that.parallaxIt(e, ".motion-effects1", -30);
      that.parallaxIt(e, ".motion-effects2", -30);
      that.parallaxIt(e, ".motion-effects3", -30);
      that.parallaxIt(e, ".motion-effects4", -10);
      that.parallaxIt(e, ".motion-effects5", -30);
      that.parallaxIt(e, ".motion-effects6", -30);
      that.parallaxIt(e, ".motion-effects7", -30);
      that.parallaxIt(e, ".motion-effects8", -30);
      that.parallaxIt(e, ".motion-effects9", -30);
      that.parallaxIt(e, ".motion-effects10", -30);
      that.parallaxIt(e, ".motion-effects11", 30);
      that.parallaxIt(e, ".motion-effects12", -100);
      that.parallaxIt(e, ".motion-effects13", 100);
    });

  }
  parallaxIt(e, target_class, movement) {
    let $wrap = $(e.target).parents(".motion-effects-wrap");
    if (!$wrap.length) return;
    let $target = $wrap.find(target_class);
    let relX = e.pageX - $wrap.offset().left;
    let relY = e.pageY - $wrap.offset().top;
    TweenMax.to($target, 1, {
      x: ((relX - $wrap.width() / 2) / $wrap.width()) * movement,
      y: ((relY - $wrap.height() / 2) / $wrap.height()) * movement,
    });
  }
  getCityList(): void {
    this.propertyService.getCities().subscribe(cityRes => {
      if (cityRes.length > 0) {
        this.cityList = cityRes;
      }
    })
  }
  onSearchHome() {
    console.log('this.homeSearchForm', this.homeSearchForm);
    let filterURL = `/properties`;
    const filters = [];
    if (this.homeSearchForm.title) {
      filters.push(`title=${encodeURIComponent(this.homeSearchForm.title)}`);
    }
    if (this.homeSearchForm.space) {
      filters.push(`space=${encodeURIComponent(this.homeSearchForm.space)}`);
    }
    if (this.homeSearchForm.city) {
      filters.push(`city=${encodeURIComponent(this.homeSearchForm.city)}`);
    }
    if (this.homeSearchForm.minHeight) {
      filters.push(`minHeight=${encodeURIComponent(this.homeSearchForm.minHeight)}`);
    }
    if (this.homeSearchForm.minWidth) {
      filters.push(`minWidth=${encodeURIComponent(this.homeSearchForm.minWidth)}`);
    }
    if (this.homeSearchForm.priceRange) {
      filters.push(`priceRange=${encodeURIComponent(this.homeSearchForm.priceRange)}`);
    }
    if (this.homeSearchForm.includePrintInstall) {
      filters.push(`includePrintInstall=${encodeURIComponent(this.homeSearchForm.includePrintInstall)}`);
    }
   
    if (filters.length) {
      filterURL += `?${filters.join('&')}`;
    }
    console.log('filterURL', filterURL);
    this.router.navigateByUrl(filterURL);
  }
  openMoreFilter() {
    this.showMoreFilter = !this.showMoreFilter;
  }
  applyFilter() {
    this.showMoreFilter = false;
  }
  clearFilter() {
    this.homeSearchForm = {
      title: '',
      space: null,
      city: null,
      minHeight: null,
      minWidth: null,
      priceRange: null,
      includePrintInstall: false,
    };
    this.showMoreFilter = false;
  }
}
