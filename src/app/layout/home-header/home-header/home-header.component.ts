import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoggedInUser } from '@services/auth/auth.service';
import { RoutingService } from '@services/routing/routing.service';
import { ScriptLoaderService } from '@services/script-loader/script-loader.service';

import { Subscription } from 'rxjs/index';
const subscriberList: Array<Subscription> = []

declare var $: any;
declare var WOW: any;
// declare var noUiSlider: any;
// declare var wNumb: any;
declare var Swiper: any;

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit, AfterViewInit {

  isHomePage: boolean = false;
  loginUserData: LoggedInUser | null;

  constructor(
    private router: Router,
    private routing: RoutingService,
    private scriptLoader: ScriptLoaderService,
    private authService: AuthService
  ) {
    // this.fixedHeader();
  }

  ngOnInit(): void {

    subscriberList.push(
      this.authService.loginState.subscribe(loginState => {
        console.log('loginState', loginState);
        this.loginUserData = this.authService.getUser();
        console.log('this.loginUserData', this.loginUserData);
        // if (loginState) {
        //   this.loginUserData = this.authService.getUser();
        // } else {
        //   this.loginUserData = this.authService.getUser();
        // }
      })
    );
    subscriberList.push(
      this.routing.$currentPage.subscribe(currentPage => {
        this.isHomePage = false;
        if (['/', '/home'].indexOf(currentPage) > -1) {
          this.isHomePage = true;
        }
        // this.scriptLoader.loadScript();


        this.windowScroll();
        this.fixedHeader();
        this.mobileMenuToggle();
        this.mobileMenuDropdown();
        this.bgToImage();
        /*---------------------------------------
        Background Parallax
        --------------------------------------- */
        $(window).on("load resize", function () {
          if ($(window).width() >= 768) {
            if ($(".parallaxie").length) {
              $(".parallaxie").parallaxie({
                speed: 0.5,
                offset: 0,
              });
            }
          }
        });

        /*------------------------------
        // Tooltip
        ------------------------------*/
        $(function () {
          $('[data-bs-toggle="tooltip"]').tooltip('dispose');
          setTimeout(() => {
            $('[data-bs-toggle="tooltip"]').tooltip({
              offset: [0, 5],
            });  
          }, 500);
        });

        /*-------------------------------------
          Jquery Serch Box
          -------------------------------------*/
        $('a[href="#template-search"]').on("click", (event: any) => {
          event.preventDefault();
          var target = $("#template-search");
          target.addClass("open");
          setTimeout(function () {
            target.find("input").focus();
          }, 600);
          return false;
        });
        $("#template-search, #template-search button.close").on(
          "click keyup",
          (event: any) => {
            if (
              event.target === this ||
              event.target.className === "close" ||
              event.keyCode === 27
            ) {
              $(this).removeClass("open");
            }
          }
        );

        /*-------------------------------------
          YouTube Popup
          -------------------------------------*/
        var yPopup = $(".play-btn");
        if (yPopup.length) {
          yPopup.magnificPopup({
            disableOn: 700,
            type: "iframe",
            mainClass: "mfp-fade",
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
          });
        }
        // var yPopup = $(".video-btn");
        // if (yPopup.length) {
        //   yPopup.magnificPopup({
        //     disableOn: 700,
        //     type: "iframe",
        //     mainClass: "mfp-fade",
        //     removalDelay: 160,
        //     preloader: false,
        //     fixedContentPos: false,
        //   });
        // }
        /*-------------------------------------
        dropdown Filter
        -------------------------------------*/
        // $(".dropdown-filter, .rt-filter-btn-1").on("click", function () {
        //   $(".explore__form-checkbox-list").toggleClass("filter-block");
        // });



        /*-------------------------------------
        Wow Js
        -------------------------------------*/
        var wow = new WOW({
          boxClass: "wow",
          animateClass: "animated",
          offset: 0,
          mobile: false,
          live: true,
          scrollContainer: null,
        });
        wow.init();

        /*-----------------------------------
        // counter up
        ----------------------------------*/
        let counter = true;
        $(".counter-appear").appear();
        $(".counter-appear").on("appear", function () {
          if (counter) {
            // with skill bar
            $(".skill-per").each(function () {
              let $this = $(this);
              let per = $this.attr("data-per");
              $this.css("width", per + "%");
              $({ animatedValue: 0 }).animate(
                { animatedValue: per },
                {
                  duration: 1000,
                  step: function () {
                    $this.attr("data-per", Math.floor(this.animatedValue) + "%");
                  },
                  complete: function () {
                    $this.attr("data-per", Math.floor(this.animatedValue) + "%");
                  },
                }
              );
            });

            // Only number counter
            $(".counterUp").each(function () {
              let $this = $(this);
              $({
                Counter: 0,
              }).animate(
                {
                  Counter: $this.attr("data-counter"),
                },
                {
                  duration: 3000,
                  easing: "swing",
                  step: function () {
                    let num = Math.ceil(this.Counter).toString();
                    if (Number(num) > 99999999) {
                      while (/(\d+)(\d{8})/.test(num)) {
                        num = num.replace(/(\d+)(\d{8})/, "");
                      }
                    }
                    $this.html(num);
                  },
                }
              );
            });

            counter = false;
          }
        });

        /*======================================
          //Radio
        ====================================*/
        let $searcHradioButtons = $('.search-radio input[type="radio"]');
        $searcHradioButtons.click(function () {
          $searcHradioButtons.each(function () {
            $(this).parent().toggleClass("active", this.checked);
          });
        });

        /*==============================
        //  Back to Top
        ===============================*/
        let $window = $(window);
        let distance = 300;
        $window.scroll(function () {
          if ($window.scrollTop() >= distance) {
            $("#back-to-top").fadeIn();
          } else {
            $("#back-to-top").fadeOut();
          }
        });
        $('body').off('click', '#back-to-top').on('click', '#back-to-top', function () {
          $("html, body").animate(
            {
              scrollTop: 0,
            },
            800
          );
        });
        // let priceSlider = document.getElementById("price-range-filter") as any;
        // if (priceSlider) {
        //   noUiSlider.create(priceSlider, {
        //     start: [10, 70],
        //     connect: true,
        //     range: {
        //       min: 0,
        //       max: 100,
        //     },
        //     format: wNumb({
        //       decimals: 0,
        //     }),
        //   });
        //   let marginMin = document.getElementById("price-range-min"),
        //     marginMax = document.getElementById("price-range-max");
        //   priceSlider.noUiSlider.on("update", function (values, handle) {
        //     if (handle) {
        //       marginMax.innerHTML = values[handle] + "%";
        //     } else {
        //       marginMin.innerHTML = values[handle] + "%";
        //     }
        //   });
        // }
        // // Price range filter
        // let priceSlider2 = document.getElementById("price-range-filter-2") as any;
        // if (priceSlider2) {
        //   noUiSlider.create(priceSlider2, {
        //     start: [0, 500],
        //     connect: true,
        //     range: {
        //       min: 0,
        //       max: 700,
        //     },
        //     format: wNumb({
        //       decimals: 0,
        //     }),
        //   });
        //   let marginMin = document.getElementById("price-range-min-2"),
        //     marginMax = document.getElementById("price-range-max-2");
        //   priceSlider2.noUiSlider.on("update", function (values, handle) {
        //     if (handle) {
        //       marginMax.innerHTML = values[handle];
        //     } else {
        //       marginMin.innerHTML = values[handle];
        //     }
        //   });
        // }
        // // Price range filter
        // let priceSlider3 = document.getElementById("price-range-filter-3") as any;
        // if (priceSlider3) {
        //   noUiSlider.create(priceSlider3, {
        //     start: [0, 20000],
        //     connect: true,
        //     range: {
        //       min: 0,
        //       max: 30000,
        //     },
        //     format: wNumb({
        //       decimals: 0,
        //     }),
        //   });
        //   let marginMin = document.getElementById("price-range-min-3"),
        //     marginMax = document.getElementById("price-range-max-3");
        //   priceSlider3.noUiSlider.on("update", function (values, handle) {
        //     if (handle) {
        //       marginMax.innerHTML = values[handle];
        //     } else {
        //       marginMin.innerHTML = values[handle];
        //     }
        //   });
        // }
        

        /*---------------------------------------
        // rt-slider-style-6
        ----------------------------------------*/
        $(".testimonial-layout1").each(function (i) {
          let rtSliderStyle1 = $(this).get(0);
          let prev = $(this)
            .parents(".rt-slide-wrap")
            .find(".swiper-button-prev")
            .get(0);
          let next = $(this)
            .parents(".rt-slide-wrap")
            .find(".swiper-button-next")
            .get(0);

          new Swiper(rtSliderStyle1, {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            slideToClickedSlide: true,
            autoplay: {
              delay: 4000,
            },
            navigation: {
              nextEl: next,
              prevEl: prev,
            },
            speed: 800,
          });
        });

        var featureBoxSlider = new Swiper(".featured-thum-slider", {
          spaceBetween: 20,
          slidesPerView: 3,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          loop: true,
          breakpoints: {
            0: {
              slidesPerView: 2,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
            1500: {
              slidesPerView: 3,
            },
          },
        });

        

        var swiper5 = new Swiper(".brand-layout", {
          slidesPerView: 5,
          spaceBetween: 30,
          autoplay: {
            delay: 4000,
          },
          speed: 800,
          breakpoints: {
            0: {
              slidesPerView: 1,
            },
            576: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            992: {
              slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
            1500: {
              slidesPerView: 5,
            },
          },
        });
      })
    );
  }
  ngAfterViewInit(): void {
    
  }
  ngOnDestroy(): void {
    subscriberList.forEach((subscriber: Subscription) => {
      subscriber.unsubscribe();
    })
  }

  bgToImage(): void {
    const dbi = document.querySelectorAll('[data-bg-image]');
    dbi.forEach((dbImage: any) => {
      var img = dbImage.getAttribute('data-bg-image');
      if (img) {
        dbImage.style.backgroundImage = `url(${img})`;
      }
    });
  }

  windowScroll(): void {
    $(window).on("scroll", function () {
      // Back Top Button
      if ($(window).scrollTop() > 500) {
        $(".scrollup").addClass("back-top");
      } else {
        $(".scrollup").removeClass("back-top");
      }

      // Sticky Header
      if ($("body").hasClass("sticky-header")) {
        var stickyPlaceHolder = $("#rt-sticky-placeholder"),
          menu = $("#header-menu"),
          menuMobile = $("#meanmenu"),
          menuH = menu.outerHeight(),
          menuMobileH = menu.outerHeight(),
          topHeaderH = $("#header-topbar").outerHeight() || 0,
          middleHeaderH = $("#header-middlebar").outerHeight() || 0,
          targrtScroll = topHeaderH + middleHeaderH;
        if ($(window).scrollTop() > targrtScroll) {
          menu.addClass("rt-sticky");
          stickyPlaceHolder.height(menuH);
        } else {
          menu.removeClass("rt-sticky");
          stickyPlaceHolder.height(0);
        }
        if ($(window).scrollTop() > 300) {
          menuMobile.addClass("rt-sticky");
          stickyPlaceHolder.height(menuMobileH);
        } else {
          menuMobile.removeClass("rt-sticky");
          stickyPlaceHolder.height(0);
        }
      }
    });
  }
  fixedHeader(): void {
    $(window).on("scroll", function () {
      if ($(".rt-header").hasClass("sticky-on")) {
        let stickyPlaceHolder = $("#sticky-placeholder"),
          menu = $("#navbar-wrap"),
          menuH = menu.outerHeight(),
          menuMobile = $("#meanmenu"),
          topbarH = $("#topbar-wrap").outerHeight() || 0,
          targrtScroll = topbarH,
          header = $("header");

        if ($(window).scrollTop() > targrtScroll) {
          header.addClass("sticky");
          stickyPlaceHolder.height(menuH);
        } else {
          header.removeClass("sticky");
          menu.removeClass("rt-sticky");
          stickyPlaceHolder.height(targrtScroll);
        }
        if ($(window).scrollTop() > 300) {
          menuMobile.addClass("rt-sticky");
        } else {
          menuMobile.removeClass("rt-sticky");
        }
      }
    });
  }
  mobileMenuToggle(): void {
    /*-------------------------------------
      Mobile Menu Toggle
      -------------------------------------*/
    $(".sidebarBtn").off("click").on("click", (e: any) => {
      e.preventDefault();
      if ($(".rt-slide-nav").is(":visible")) {
        $(".rt-slide-nav").slideUp();
        $("body").removeClass("slidemenuon");
      } else {
        $(".rt-slide-nav").slideDown();
        $("body").addClass("slidemenuon");
      }
    });
  }
  mobileMenuDropdown(): void {
    /*-------------------------------------
    Mobile Menu Dropdown
    -------------------------------------*/
    var a = $(".offscreen-navigation .menu");
    if (a.length) {
      a.children("li").addClass("menu-item-parent");
      a.find(".menu-item-has-children > a").on("click", (e: any) => {
        e.preventDefault();
        $(this).toggleClass("opened");
        var n = $(this).next(".sub-menu"),
          s = $(this).closest(".menu-item-parent").find(".sub-menu");
        a.find(".sub-menu").not(s).slideUp(250).prev("a").removeClass("opened"),
          n.slideToggle(250);
      });
      a.find(".menu-item:not(.menu-item-has-children) > a").on(
        "click",
        (e: any) => {
          $(".rt-slide-nav").slideUp();
          $("body").removeClass("slidemenuon");
        }
      );
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe(
      (logoutData) => {
        console.log('logoutData', logoutData);
        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
        this.authService.removeUser();
        this.router.navigateByUrl(`/`);
      },
      (logoutError) => {
        console.log('logoutError', logoutError);
      }
    )
  }

}
