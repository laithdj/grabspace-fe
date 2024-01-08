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

  propertyTypes = [];
  propertyStatusList = [];
  cityList = [];
  amenitiesList = [];
  homeSearchForm = {
    title: '',
    type: null,
    city: null,
    category: null,
    bedrooms: null,
    bathrooms: null,
    salePrice: null,
    landDAApproved: null,
    amenities: []
  };
  showMoreFilter = false;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getPropertyTypesList();
    this.getPropertyStatusList();
    this.getCityList();
    this.getAmenitiesList();
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
  getPropertyTypesList(): void {
    this.propertyService.getPropertyTypes().subscribe(typeRes => {
      if (typeRes.length > 0) {
        this.propertyTypes = typeRes;

      }
    })
  }
  getPropertyStatusList(): void {
    this.propertyService.getPropertyStatus().subscribe(statusRes => {
      if (statusRes.length > 0) {
        this.propertyStatusList = statusRes;
      }
    })
  }
  getCityList(): void {
    this.propertyService.getCities().subscribe(cityRes => {
      if (cityRes.length > 0) {
        this.cityList = cityRes;
      }
    })
  }
  getAmenitiesList(): void {
    this.propertyService.getAmenities().subscribe(amenitiesRes => {
      if (amenitiesRes.length > 0) {
        this.amenitiesList = amenitiesRes.map(obj => {
          obj.isChecked = false;
          return obj;
        });
      }
    })
  }
  onChangeSearchAmenity(isChecked: boolean, amenityId: string) {
    console.log('onChangeSearchAmenity called.', isChecked, amenityId);
    const existingIndex = this.homeSearchForm.amenities.indexOf(amenityId);
    if (isChecked && existingIndex <= -1) {
      this.homeSearchForm.amenities.push(amenityId);
      return;
    }
    if (!isChecked && existingIndex > -1) {
      this.homeSearchForm.amenities.splice(existingIndex, 1);
      return;
    }
  }
  onSearchHome() {
    console.log('this.homeSearchForm', this.homeSearchForm);
    let filterURL = `/properties`;
    const filters = [];
    if (this.homeSearchForm.title) {
      filters.push(`title=${encodeURIComponent(this.homeSearchForm.title)}`);
    }
    if (this.homeSearchForm.type) {
      filters.push(`type=${encodeURIComponent(this.homeSearchForm.type)}`);
    }
    if (this.homeSearchForm.city) {
      filters.push(`city=${encodeURIComponent(this.homeSearchForm.city)}`);
    }
    if (this.homeSearchForm.category) {
      filters.push(`category=${encodeURIComponent(this.homeSearchForm.category)}`);
    }
    if (this.homeSearchForm.bedrooms) {
      filters.push(`bedrooms=${encodeURIComponent(this.homeSearchForm.bedrooms)}`);
    }
    if (this.homeSearchForm.landDAApproved) {
      filters.push(`landDAApproved=${encodeURIComponent(this.homeSearchForm.landDAApproved)}`);
    }
    if (this.homeSearchForm.amenities?.length) {
      filters.push(`amenities=${this.homeSearchForm.amenities.join('|')}`);
    }
    if (this.homeSearchForm.bathrooms) {
      filters.push(`bathrooms=${encodeURIComponent(this.homeSearchForm.bathrooms)}`);
    }
    if (this.homeSearchForm.salePrice) {
      filters.push(`salePrice=${encodeURIComponent(this.homeSearchForm.salePrice)}`);
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
      type: null,
      city: null,
      category: null,
      bedrooms: null,
      bathrooms: null,
      salePrice: null,
      landDAApproved: null,
      amenities: []
    };
    if (this.amenitiesList?.length) {
      this.amenitiesList.forEach(amenity => {
        amenity.isChecked = false;
      })
    }
    this.showMoreFilter = false;
  }
}
