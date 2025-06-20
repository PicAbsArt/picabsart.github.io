/*!
 * lightbox v2.11.3
 * Copyright 2020 Lokesh Dhakar
 */
(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const Lightbox = function (options) {
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();
    
    options = options || {};
    this.options = {
      albumLabel: "Image %1 of %2",
      alwaysShowNavOnTouchDevices: !1,
      fadeDuration: 500,
      fitImagesInViewport: !0,
      imageFadeDuration: 500,
      positionFromTop: 50,
      resizeDuration: 700,
      showImageNumberLabel: !0,
      wrapAround: !1,
      disableScrolling: !1,
      ...options
    };
  };

  Lightbox.prototype = {
    init() {
      this.enable();
    },

    enable() {
      this.build();
      this.update();
    },

    build() {
      const self = this;
      const $lightbox = document.createElement('div');
      $lightbox.setAttribute("id", "lightbox");
      $lightbox.style.display = "none";
      $lightbox.innerHTML = `
        <div class="lb-overlay"></div>
        <div class="lb-outerContainer">
          <div class="lb-container">
            <img class="lb-image" src="" />
            <div class="lb-nav">
              <a class="lb-prev" href=""></a>
              <a class="lb-next" href=""></a>
            </div>
          </div>
        </div>
        <div class="lb-loader">
          <a class="lb-cancel"></a>
        </div>
        <div class="lb-dataContainer">
          <div class="lb-data">
            <div class="lb-details">
              <span class="lb-caption"></span>
              <span class="lb-number"></span>
            </div>
            <div class="lb-closeContainer">
              <a class="lb-close"></a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild($lightbox);

      this.$lightbox = $lightbox;
      this.$overlay = $('.lb-overlay', $lightbox);
      this.$outerContainer = $('.lb-outerContainer', $lightbox);
      this.$container = $('.lb-container', $lightbox);
      this.$image = $('.lb-image', $lightbox);
      this.$nav = $('.lb-nav', $lightbox);
      this.$prev = $('.lb-prev', $lightbox);
      this.$next = $('.lb-next', $lightbox);
      this.$loader = $('.lb-loader', $lightbox);
      this.$caption = $('.lb-caption', $lightbox);
      this.$number = $('.lb-number', $lightbox);
      this.$close = $('.lb-close', $lightbox);
      this.$counter = $('.lb-counter');

      ['resize', 'scroll', 'click', 'keydown'].forEach(event => {
        window.addEventListener(event, this);
      });

      this.$prev.addEventListener('click', e => {
        e.preventDefault();
        if (self.prevImage()) self.changeImage(self.currentImageIndex - 1);
      });

      this.$next.addEventListener('click', e => {
        e.preventDefault();
        if (self.nextImage()) self.changeImage(self.currentImageIndex + 1);
      });

      this.$close.addEventListener('click', e => {
        e.preventDefault();
        self.end();
      });

      this.$overlay.addEventListener('click', e => {
        if (e.target === this.$overlay) self.end();
      });
    },

    start() {
      const self = this;
      const $target = event.currentTarget;

      this.album = [];
      const links = document.links;
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href && link.hasAttribute('data-lightbox')) {
          this.album.push({
            href: link.getAttribute('href'),
            title: link.getAttribute('data-title') || ''
          });
        }
      }

      let index = 0;
      while (index < this.album.length && $target !== links[index]) {
        index++;
      }

      this.currentImageIndex = index;
      this.show();
    },

    show() {
      this.updateImage();
      this.$lightbox.style.display = 'block';
      this.positionLightbox();
    },

    updateImage() {
      if (this.album.length > 0) {
        const current = this.album[this.currentImageIndex];
        this.$image.alt = current.title;
        this.$caption.textContent = current.title;
        this.$image.src = '';
        this.preloadNeighboringImages();
        this.loadImage(current.href);
      }
    },

    loadImage(src) {
      const self = this;
      const img = new Image();
      img.onload = () => {
        self.$image.src = src;
        self.resizeImage(() => {
          self.fadeInImage();
        });
      };
      img.src = src;
    },

    fadeInImage() {
      const self = this;
      this.$loader.style.display = 'none';
      this.$image.style.opacity = 0;
      this.$image.style.display = '';
      this.animate(this.$image, { opacity: 1 }, this.options.imageFadeDuration / 1000);
    },

    resizeImage(callback) {
      const self = this;
      const viewportWidth = window.innerWidth * 0.8;
      const viewportHeight = window.innerHeight * 0.8;
      const imgWidth = this.$image.naturalWidth;
      const imgHeight = this.$image.naturalHeight;

      let width, height;

      if (imgWidth / imgHeight > viewportWidth / viewportHeight) {
        if (imgWidth > viewportWidth) {
          width = viewportWidth;
          height = imgHeight * (width / imgWidth);
        } else {
          width = imgWidth;
          height = imgHeight;
        }
      } else {
        if (imgHeight > viewportHeight) {
          height = viewportHeight;
          width = imgWidth * (height / imgHeight);
        } else {
          width = imgWidth;
          height = imgHeight;
        }
      }

      this.$outerContainer.style.width = `${width}px`;
      this.$outerContainer.style.height = `${height}px`;

      callback();
    },

    positionLightbox() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.$lightbox.style.top = `${scrollTop + this.options.positionFromTop}px`;
    },

    preloadNeighboringImages() {
      const nextIndex = this.currentImageIndex + 1;
      const prevIndex = this.currentImageIndex - 1;

      if (this.album[nextIndex]) {
        const nextImage = new Image();
        nextImage.src = this.album[nextIndex].href;
      }

      if (this.album[prevIndex]) {
        const prevImage = new Image();
        prevImage.src = this.album[prevIndex].href;
      }
    },

    animate(element, properties, duration, easing = 'ease', delay = 0) {
      element.style.transition = `all ${duration}s ${easing} ${delay}s`;
      Object.entries(properties).forEach(([key, value]) => {
        element.style[key] = value;
      });
    },

    handleEvent(event) {
      switch (event.type) {
        case 'resize':
          this.positionLightbox();
          break;
        case 'scroll':
          this.positionLightbox();
          break;
        case 'click':
          if (event.target.hasAttribute('data-lightbox')) {
            event.preventDefault();
            this.start(event);
          }
          break;
        case 'keydown':
          this.keyDown(event);
          break;
      }
    },

    keyDown(event) {
      const KEY = {
        ESC: 27,
        ARROW_LEFT: 37,
        ARROW_RIGHT: 39
      };

      const keycode = event.keyCode;
      const key = String.fromCharCode(keycode).toLowerCase();

      if (keycode === KEY.ESC) {
        this.end();
      } else if (keycode === KEY.ARROW_LEFT) {
        this.prevImage();
      } else if (keycode === KEY.ARROW_RIGHT) {
        this.nextImage();
      }
    },

    prevImage() {
      if (this.currentImageIndex > 0) {
        return true;
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.currentImageIndex = this.album.length - 1;
        return true;
      }
      return false;
    },

    nextImage() {
      if (this.currentImageIndex < this.album.length - 1) {
        return true;
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.currentImageIndex = 0;
        return true;
      }
      return false;
    },

    end() {
      this.$lightbox.style.display = 'none';
    }
  };

  // Initialize on click for all [data-lightbox] elements
  document.addEventListener('click', function (event) {
    const target = event.target.closest('[data-lightbox]');
    if (!target) return;
    event.preventDefault();
    const lb = new Lightbox();
    lb.start.call(lb, event);
  });
})();
