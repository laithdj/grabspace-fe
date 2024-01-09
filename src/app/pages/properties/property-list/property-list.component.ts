import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '@pages/profile/services/property/property.service';
import { backendurl, baseurl } from 'src/environments/environment';

declare var $: any;
declare var noUiSlider: any;
declare var wNumb: any;

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {

  propertyList: Array<{
    id: string;
    title: string;
    image: string;
    city: string;
  }> = [];
  priceRangeFilter = null;
  searchForm = {
    title: '',
    space: 'ALL',
    city: 'ALL',
    minHeight: 'ALL',
    minWidth: 'ALL',
    priceRange: 'ALL',
    includePrintInstall: 'ALL',
  };
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
  propertyTypes = [];
  propertyStatusList = [];
  cityList = [];
  isListLoading: boolean;

  constructor(
    private propertyService: PropertyService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((query: any) => {
      console.log('query', query);
      const filterData = this.getFilterValues(query);
      this.getPropertyList(filterData);
      
      // this.loadPriceRangeFilter();
      // this.getPropertyTypesList();
      // this.getPropertyStatusList();
      this.getCityList();
    })
  }
  ngAfterViewInit() {
    // $("select").niceSelect();
  }
  ngOnDestroy() {
    // if (this.priceRangeFilter.noUiSlider) {
    //   this.priceRangeFilter.noUiSlider.destroy();
    // }
  }
  // loadPriceRangeFilter() {
  //   // Price range filter
  //   this.priceRangeFilter = document.getElementById("price-range-filter-4") as any;
  //   if (this.priceRangeFilter) {
  //     noUiSlider.create(this.priceRangeFilter, {
  //       start: [0, 500000],
  //       connect: true,
  //       range: {
  //         min: 0,
  //         max: 700000,
  //       },
  //       format: wNumb({
  //         decimals: 0,
  //       }),
  //     });
  //     let marginMin = document.getElementById("price-range-min-4"),
  //       marginMax = document.getElementById("price-range-max-4");
  //     this.priceRangeFilter.noUiSlider.on("update", function (values, handle) {
  //       if (handle) {
  //         marginMax.innerHTML = values[handle];
  //       } else {
  //         marginMin.innerHTML = values[handle];
  //       }
  //     });
  //   }
  // }
  getFilterValues(query) {
    const filterValues = {} as any;
    if (query.title) {
      filterValues.title = query.title;
    }
    if (query.space) {
      filterValues.space = query.space;
    }
    if (query.city) {
      filterValues.cityId = query.city;
    }
    if (query.minHeight) {
      filterValues.minHeight = query.minHeight;
    }
    if (query.minWidth) {
      filterValues.minWidth = query.minWidth;
    }
    if (query.priceRange) {
      filterValues.priceRange = query.priceRange;
    }
    if (query.includePrintInstall) {
      filterValues.includePrintInstall = query.includePrintInstall;
    }
    return filterValues;
  }
  // getPropertyTypesList(): void {
  //   this.propertyService.getPropertyTypes().subscribe(typeRes => {
  //     if (typeRes.length > 0) {
  //       this.propertyTypes = typeRes;
  //       setTimeout(() => {
  //         $("select.property-type").niceSelect();
  //       }, 100);

  //     }
  //   })
  // }
  // getPropertyStatusList(): void {
  //   this.propertyService.getPropertyStatus().subscribe(statusRes => {
  //     if (statusRes.length > 0) {
  //       this.propertyStatusList = statusRes;
  //     }
  //   })
  // }
  getCityList(): void {
    this.propertyService.getCities().subscribe(cityRes => {
      if (cityRes.length > 0) {
        this.cityList = cityRes;
      }
    })
  }
  getPropertyList(filterData?: any) {
    this.isListLoading = true;
    this.propertyList = [];
    const postData = typeof filterData !== 'undefined' ? filterData : {};
    console.log('postData', postData);
    this.propertyService.getProperties(postData).subscribe(
      (propRes: any) => {
        if (propRes.length) {
          for (const propValue of propRes) {
            let imageSrc = '';
            if (propValue.images?.length) {
              imageSrc = `${backendurl}/${propValue.images[0].path}`;
            }
            this.propertyList.push({
              id: propValue.id,
              title: propValue.title,
              image: imageSrc,
              city: propValue.city?.name,
            })
          }
        }
        setTimeout(() => {
          this.isListLoading = false;
        }, 1000);
      },
      (propErr) => {
        this.propertyList = [];
        setTimeout(() => {
          this.isListLoading = false;
        }, 1000);
      }
    );
  }

  onAdvanceSearch(): void {
    console.log('this.searchForm', this.searchForm);
    const dataToSend = {} as any;
    if (this.searchForm.title) {
      dataToSend.title = this.searchForm.title;
    }
    if (this.searchForm.space !== 'ALL') {
      dataToSend.space = this.searchForm.space;
    }
    if (this.searchForm.city !== 'ALL') {
      dataToSend.cityId = this.searchForm.city;
    }
    if (this.searchForm.minHeight !== 'ALL') {
      dataToSend.minHeight = this.searchForm.minHeight;
    }
    if (this.searchForm.minWidth !== 'ALL') {
      dataToSend.minWidth = this.searchForm.minWidth;
    }
    if (this.searchForm.priceRange !== 'ALL') {
      dataToSend.priceRange = this.searchForm.priceRange;
    }
    if (this.searchForm.includePrintInstall !== 'ALL') {
      dataToSend.includePrintInstall = this.searchForm.includePrintInstall;
    }
    this.getPropertyList(dataToSend);
  }

}
