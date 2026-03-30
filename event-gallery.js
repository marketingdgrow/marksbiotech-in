(() => {
  const body = document.body;
  if (!body) return;

  initGalleryLightboxes();
  initRevealAnimations();

  function initGalleryLightboxes() {
    const galleries = Array.from(document.querySelectorAll("[data-event-gallery]"));
    if (!galleries.length) return;

    const lightbox = createLightbox();
    let currentImages = [];
    let currentIndex = 0;
    let pageScrollY = 0;

    galleries.forEach((gallery) => {
      const windowEl = gallery.querySelector("[data-gallery-window]");
      const prevBtn = gallery.querySelector("[data-gallery-prev]");
      const nextBtn = gallery.querySelector("[data-gallery-next]");
      const slides = Array.from(gallery.querySelectorAll("[data-gallery-image]"));

      if (!windowEl || !slides.length) return;

      const scrollStep = () => Math.max(windowEl.clientWidth * 0.86, 280);
      let pointerStart = null;
      let pointerMoved = false;
      let releaseTimer = 0;

      const resetPointerState = () => {
        pointerStart = null;
        window.clearTimeout(releaseTimer);
        releaseTimer = window.setTimeout(() => {
          pointerMoved = false;
        }, 0);
      };

      windowEl.addEventListener(
        "pointerdown",
        (event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          pointerStart = { x: event.clientX, y: event.clientY };
          pointerMoved = false;
          window.clearTimeout(releaseTimer);
        },
        { passive: true }
      );

      windowEl.addEventListener(
        "pointermove",
        (event) => {
          if (!pointerStart) return;
          const movedX = Math.abs(event.clientX - pointerStart.x);
          const movedY = Math.abs(event.clientY - pointerStart.y);
          if (movedX > 10 || movedY > 10) {
            pointerMoved = true;
          }
        },
        { passive: true }
      );

      windowEl.addEventListener("pointerup", resetPointerState, { passive: true });
      windowEl.addEventListener("pointercancel", resetPointerState, { passive: true });
      windowEl.addEventListener("lostpointercapture", resetPointerState, { passive: true });

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          windowEl.scrollBy({ left: -scrollStep(), behavior: "smooth" });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          windowEl.scrollBy({ left: scrollStep(), behavior: "smooth" });
        });
      }

      slides.forEach((slide, index) => {
        slide.addEventListener("click", (event) => {
          if (pointerMoved) {
            event.preventDefault();
            return;
          }

          currentImages = slides.map((item) => {
            const image = item.querySelector("img");
            return image
              ? {
                  src: image.getAttribute("src") || "",
                  alt: image.getAttribute("alt") || "Event image",
                }
              : { src: "", alt: "Event image" };
          });
          currentIndex = index;
          openLightbox();
        });
      });
    });

    function createLightbox() {
      const wrapper = document.createElement("div");
      wrapper.className = "event-lightbox";
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.innerHTML = `
        <button class="event-lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
        <button class="event-lightbox-nav prev" type="button" aria-label="Previous image">&#10094;</button>
        <figure class="event-lightbox-figure">
          <img src="" alt="" class="event-lightbox-image" />
          <figcaption class="event-lightbox-caption"></figcaption>
        </figure>
        <button class="event-lightbox-nav next" type="button" aria-label="Next image">&#10095;</button>
      `;
      body.appendChild(wrapper);

      wrapper.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (
          target.classList.contains("event-lightbox") ||
          target.classList.contains("event-lightbox-close")
        ) {
          closeLightbox();
        } else if (target.classList.contains("event-lightbox-nav")) {
          const direction = target.classList.contains("next") ? 1 : -1;
          updateLightboxImage(currentIndex + direction);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (!wrapper.classList.contains("is-open")) return;
        if (event.key === "Escape") {
          closeLightbox();
        } else if (event.key === "ArrowRight") {
          updateLightboxImage(currentIndex + 1);
        } else if (event.key === "ArrowLeft") {
          updateLightboxImage(currentIndex - 1);
        }
      });

      return wrapper;
    }

    function openLightbox() {
      if (!currentImages.length) return;
      pageScrollY = window.scrollY || window.pageYOffset;
      body.style.top = `-${pageScrollY}px`;
      body.classList.add("event-lightbox-open");
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      updateLightboxImage(currentIndex);
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      body.classList.remove("event-lightbox-open");
      body.style.top = "";
      window.scrollTo(0, pageScrollY);
    }

    function updateLightboxImage(nextIndex) {
      if (!currentImages.length) return;
      if (nextIndex < 0) nextIndex = currentImages.length - 1;
      if (nextIndex >= currentImages.length) nextIndex = 0;
      currentIndex = nextIndex;

      const imageData = currentImages[currentIndex];
      const imageEl = lightbox.querySelector(".event-lightbox-image");
      const captionEl = lightbox.querySelector(".event-lightbox-caption");

      if (imageEl instanceof HTMLImageElement) {
        imageEl.src = imageData.src;
        imageEl.alt = imageData.alt;
      }
      if (captionEl) {
        captionEl.textContent = imageData.alt;
      }
    }
  }

  function initRevealAnimations() {
    const selectors = [];

    if (body.classList.contains("events-enhanced-page")) {
      selectors.push(
        ".events-enhanced-page .event-left",
        ".events-enhanced-page .event-right",
        ".events-enhanced-page .course-left",
        ".events-enhanced-page .course-right",
        ".events-enhanced-page .gallery-title-wrap",
        ".events-enhanced-page .gallery-slide",
        ".events-enhanced-page .course-side",
        ".events-enhanced-page .course-main",
        ".events-enhanced-page .event-sidebar",
        ".events-enhanced-page .event-content",
        ".events-enhanced-page .event-about .event-container",
        ".events-enhanced-page .event-showcase .event-container",
        ".events-enhanced-page .showcase-card"
      );
    }

    if (body.classList.contains("events-list-page")) {
      selectors.push(
        ".events-list-page .top-banner-careers h1",
        ".events-list-page .tabs",
        ".events-list-page .sub-tabs"
      );
    }

    if (!selectors.length) return;

    const items = Array.from(
      new Set(
        selectors.reduce((allItems, selector) => {
          return allItems.concat(Array.from(document.querySelectorAll(selector)));
        }, [])
      )
    );

    if (!items.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    items.forEach((item, index) => {
      const delay = Math.min(index * 45, body.classList.contains("events-list-page") ? 180 : 320);
      item.classList.add("reveal-up");
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: isMobile ? 0.08 : 0.16,
        rootMargin: isMobile ? "0px 0px -10% 0px" : "0px 0px -14% 0px",
      }
    );

    items.forEach((item) => observer.observe(item));
  }
})();
