// ======================================
// GSAP + SCROLLTRIGGER SETUP
// ======================================
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
});

/* ================= BURGER ================= */
const burger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-main-menu");

function setMobileMenuState(isOpen) {
  if (!navMenu) return;
  navMenu.classList.toggle("active", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
}

if (burger && navMenu) {
  burger.addEventListener("click", () => {
    setMobileMenuState(!navMenu.classList.contains("active"));
  });
}

const uniqueLink = document.querySelector("#unique > a");
const col3 = document.getElementById("col3");
const uniqueItem = document.getElementById("unique");
const dentalMega = uniqueItem ? uniqueItem.closest(".has-mega") : null;
let col3OriginalParent = null;
let col3OriginalNextSibling = null;

if (col3) {
  col3OriginalParent = col3.parentElement;
  col3OriginalNextSibling = col3.nextElementSibling;
}

function setCol3State(isOpen) {
  if (!col3) return;
  col3.classList.toggle("active", isOpen);
  if (dentalMega) {
    dentalMega.classList.toggle("col3-open", isOpen);
  }
}

function placeCol3ForViewport() {
  if (!col3 || !col3OriginalParent) return;

  if (col3.parentElement !== col3OriginalParent) {
    if (
      col3OriginalNextSibling &&
      col3OriginalNextSibling.parentElement === col3OriginalParent
    ) {
      col3OriginalParent.insertBefore(col3, col3OriginalNextSibling);
    } else {
      col3OriginalParent.appendChild(col3);
    }
  }

  if (window.innerWidth > 767) {
    setCol3State(false);
  }
}

function showDesktopCol3() {
  if (window.innerWidth > 767) {
    setCol3State(true);
  }
}

function hideDesktopCol3() {
  if (window.innerWidth > 767) {
    setCol3State(false);
  }
}

/* ================= MOBILE MEGA MENU CLICK ================= */
if (navMenu) {
  navMenu.addEventListener("click", (e) => {
    if (window.innerWidth > 767) return;

    if (uniqueLink && col3 && e.target.closest("#unique > a")) {
      e.preventDefault();
      e.stopPropagation();
      setCol3State(!col3.classList.contains("active"));
      return;
    }

    // Keep submenu area clickable; do not toggle parent mega.
    if (e.target.closest(".mega-menu")) {
      return;
    }

    const currentMega = e.target.closest(".has-mega");
    if (currentMega && navMenu.contains(currentMega)) {
      e.preventDefault();
      e.stopPropagation();

      const shouldOpen = !currentMega.classList.contains("open");

      navMenu.querySelectorAll(".has-mega.open").forEach((menu) => {
        if (menu !== currentMega) {
          menu.classList.remove("open");
        }
      });

      currentMega.classList.toggle("open", shouldOpen);

      if (
        col3 &&
        (!shouldOpen || (uniqueItem && !currentMega.contains(uniqueItem)))
      ) {
        setCol3State(false);
      }
      return;
    }

    // Close drawer only for top-level links.
    const link = e.target.closest("a");
    if (link && !link.closest(".mega-menu")) {
      setMobileMenuState(false);
    }
  });
}

if (uniqueItem && col3) {
  uniqueItem.addEventListener("mouseenter", showDesktopCol3);
  uniqueItem.addEventListener("focusin", showDesktopCol3);
}

if (dentalMega && col3) {
  dentalMega.addEventListener("mouseleave", hideDesktopCol3);
}

if (uniqueLink && col3) {
  uniqueLink.addEventListener("click", (e) => {
    if (window.innerWidth > 767) {
      e.preventDefault();
      e.stopPropagation();
      setCol3State(true);
    }
  });
}

/* Optional: close when clicking outside mega menu */
document.addEventListener("click", function (e) {
  if (window.innerWidth <= 767) {
    if (!e.target.closest(".has-mega")) {
      document.querySelectorAll(".has-mega.open").forEach((menu) => {
        menu.classList.remove("open");
      });

      setCol3State(false);
    }

    if (navMenu && navMenu.classList.contains("active") && !e.target.closest(".site-header")) {
      setMobileMenuState(false);
    }
  } else if (!e.target.closest(".has-mega") && col3) {
    setCol3State(false);
  }
});

window.addEventListener("resize", () => {
  placeCol3ForViewport();

  if (window.innerWidth > 767) {
    setMobileMenuState(false);

    document.querySelectorAll(".has-mega.open").forEach((menu) => {
      menu.classList.remove("open");
    });

    setCol3State(false);
  }
});

placeCol3ForViewport();
// ======================================
// HERO SECTION (ON LOAD)
// ======================================
gsap.from(".hero-title", {
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out",
});

gsap.from(".hero-subtitle", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  delay: 0.15,
  ease: "power3.out",
});

gsap.from(".hero-description", {
  y: 25,
  opacity: 0,
  duration: 0.7,
  delay: 0.3,
  ease: "power3.out",
});

gsap.from(".hero-line", {
  scaleX: 0,
  transformOrigin: "left",
  duration: 0.6,
  delay: 0.45,
  ease: "power2.out",
});

gsap.from(".hero-image", {
  x: 60,
  opacity: 0,
  duration: 1,
  delay: 0.25,
  ease: "power3.out",
});

// ======================================
// SCROLL PIN CARDS
// ======================================
// ======================================
// INFINITE SMOOTH SLIDER
// ======================================

window.addEventListener("DOMContentLoaded", function () {

  const container = document.querySelector(".over-stack-container");
  if (!container) return;

  const slides = container.querySelectorAll(".card");
  if (slides.length === 0) return;

  const track = document.createElement("div");
  track.className = "slider-track";

  // Clone first & last
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  track.appendChild(lastClone);
  slides.forEach(slide => track.appendChild(slide));
  track.appendChild(firstClone);

  container.appendChild(track);

  const allSlides = track.querySelectorAll(".card");

  let index = 1;
  let slideWidth = container.clientWidth;

  function setTrackPosition(withTransition = false) {
    slideWidth = container.clientWidth;
    track.style.transition = withTransition
      ? "transform 0.5s cubic-bezier(.77,0,.24,1)"
      : "none";
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  }

  window.addEventListener("resize", () => {
    setTrackPosition(false);
  });

  setTrackPosition(false);

  // Arrows
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "‹";
  prevBtn.className = "slider-btn prev-btn";

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "›";
  nextBtn.className = "slider-btn next-btn";

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

  function moveToSlide() {
    setTrackPosition(true);
  }

  function nextSlide() {
    if (index >= allSlides.length - 1) return;
    index++;
    moveToSlide();
  }

  function prevSlide() {
    if (index <= 0) return;
    index--;
    moveToSlide();
  }

  track.addEventListener("transitionend", () => {
    if (allSlides[index] === firstClone) {
      index = 1;
      setTrackPosition(false);
    }

    if (allSlides[index] === lastClone) {
      index = allSlides.length - 2;
      setTrackPosition(false);
    }
  });

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // AUTO LOOP
  let auto = setInterval(nextSlide, 2000);

  container.addEventListener("mouseenter", () => clearInterval(auto));
  container.addEventListener("mouseleave", () => {
    auto = setInterval(nextSlide, 2000);
  });

});



// ======================================
// SECTION 1 SCROLL REVEAL
// ======================================
gsap.from(".section-left img", {
  scrollTrigger: {
    trigger: ".section1",
    start: "top 85%",
    end: "top 30%",
    scrub: true,
  },
  x: -60,
  opacity: 0,
  ease: "power3.out",
});

gsap.from(".section-right h2, .section-right p", {
  scrollTrigger: {
    trigger: ".section1",
    start: "top 85%",
    end: "top 30%",
    scrub: true,
  },
  y: 30,
  opacity: 0,
  stagger: 0.15,
  ease: "power3.out",
});

// ======================================
// EXPAND CARDS
// ======================================
const cardex = Array.from(document.querySelectorAll(".section-4 .ex-card"));
if (cardex.length) {
  let activeCard = document.querySelector(".section-4 .ex-card.active") || cardex[0];
  let accordionResizeFrame = null;
  let mobilePointerState = null;
  let suppressMobileClickUntil = 0;

  function isMobileAccordion() {
    return window.innerWidth <= 767;
  }

  function resetMobilePointerState() {
    mobilePointerState = null;
  }

  function isInteractiveTarget(event) {
    return event.target instanceof Element && Boolean(event.target.closest("a, button"));
  }

  function getAccordionConfig() {
    if (isMobileAccordion()) {
      return {
        property: "height",
        collapsed: 84,
        expanded: 260,
        closeDuration: 0.35,
        openDuration: 0.45,
      };
    }

    if (window.innerWidth <= 767) {
      return {
        property: "width",
        collapsed: 65,
        expanded: 260,
        closeDuration: 0.4,
        openDuration: 0.55,
      };
    }

    return {
      property: "width",
      collapsed: 70,
      expanded: 360,
      closeDuration: 0.4,
      openDuration: 0.6,
    };
  }

  function syncAccordionState() {
    const { property, collapsed, expanded } = getAccordionConfig();

    cardex.forEach((card) => {
      const isActive = card === activeCard;

      gsap.killTweensOf(card);
      gsap.set(card, { clearProps: "width,height" });
      if (property === "height") {
        card.style.height = `${isActive ? expanded : collapsed}px`;
      } else {
        gsap.set(card, { [property]: isActive ? expanded : collapsed });
      }

      card.classList.toggle("active", isActive);
      card.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  }

  function toggleAccordionCard(card) {

  // SAME CARD CLICK → DO NOTHING (keep open)
  if (card === activeCard) return;

  // CLOSE OLD
  if (activeCard) {
    animateAccordionCard(activeCard, false);
  }

  // OPEN NEW
  animateAccordionCard(card, true);
  activeCard = card;


    if (activeCard) {
      animateAccordionCard(activeCard, false);
    }

    animateAccordionCard(card, true);
    activeCard = card;
  }




  function animateAccordionCard(card, isActive) {
    const { property, collapsed, expanded, closeDuration, openDuration } = getAccordionConfig();

    gsap.killTweensOf(card);
    card.classList.toggle("active", isActive);
    card.setAttribute("aria-expanded", isActive ? "true" : "false");

    if (property === "height") {
      card.style.height = `${isActive ? expanded : collapsed}px`;
      return;
    }

    gsap.to(card, {
      [property]: isActive ? expanded : collapsed,
      duration: isActive ? openDuration : closeDuration,
      ease: isActive ? "power4.out" : "power3.out",
      overwrite: true,
    });
  }

  syncAccordionState();

  cardex.forEach((card) => {


    // card.addEventListener("click", (event) => {
    //   if (isInteractiveTarget(event)) return;

    //   if (isMobileAccordion()) {
    //     if (Date.now() < suppressMobileClickUntil) {
    //       event.preventDefault();
    //       return;
    //     }

    //     toggleAccordionCard(card);
    //     return;
    //   }

    //   toggleAccordionCard(card);
    // });

    card.addEventListener("click", (event) => {
  if (isInteractiveTarget(event)) return;

  // ❌ Mobile la click completely ignore
  if (isMobileAccordion()) return;

  // Desktop only
  toggleAccordionCard(card);
});



    card.addEventListener(
      "pointerdown",
      (event) => {
        if (!isMobileAccordion()) return;

        mobilePointerState = {
          card,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          moved: false,
        };
      },
      { passive: true }
    );

    card.addEventListener(
      "pointermove",
      (event) => {
        if (!isMobileAccordion() || !mobilePointerState) return;
        if (mobilePointerState.card !== card || mobilePointerState.pointerId !== event.pointerId) return;

        const movedX = Math.abs(event.clientX - mobilePointerState.startX);
        const movedY = Math.abs(event.clientY - mobilePointerState.startY);
        if (movedX > 10 || movedY > 10) {
          mobilePointerState.moved = true;
        }
      },
      { passive: true }
    );

    card.addEventListener("pointercancel", resetMobilePointerState, { passive: true });

    card.addEventListener(
  "pointerup",
  (event) => {
    if (!isMobileAccordion()) return;

    if (!mobilePointerState) return;
    if (mobilePointerState.card !== card) return;

    const moved = mobilePointerState.moved;
    resetMobilePointerState();

    if (moved) return;

    event.preventDefault();

    // 🔥 TOGGLE SAME CARD
    toggleAccordionCard(card);
  },
  { passive: false }
);



    card.addEventListener("pointerleave", () => {
      if (!isMobileAccordion()) return;
      resetMobilePointerState();
    });

    card.addEventListener("lostpointercapture", () => {
      if (!isMobileAccordion()) return;
      resetMobilePointerState();
    });
  });

  window.addEventListener("resize", () => {
    if (accordionResizeFrame) {
      cancelAnimationFrame(accordionResizeFrame);
    }

    accordionResizeFrame = requestAnimationFrame(() => {
      resetMobilePointerState();
      suppressMobileClickUntil = 0;
      syncAccordionState();
      accordionResizeFrame = null;
    });
  });
}

// ----------  xenograft -------




 
// ======================================
// ABOUT TEAM CARDS (HOVER + CLICK TOGGLE)
// ======================================
const teamCards = document.querySelectorAll(".team-card");
const hoverCapable = window.matchMedia("(hover: hover)").matches;

if (teamCards.length) {
  teamCards.forEach((card) => {
    let isLocked = false;

    // Hover preview flip on desktop/laptop pointers.
    card.addEventListener("mouseenter", () => {
      if (!hoverCapable || isLocked) return;
      card.classList.add("is-flipped");
    });

    card.addEventListener("mouseleave", () => {
      if (!hoverCapable || isLocked) return;
      card.classList.remove("is-flipped");
    });

    // Click toggles persistent flip state for all cards.
    card.addEventListener("click", () => {
      isLocked = !isLocked;
      card.classList.toggle("is-flipped", isLocked);
    });
  });
}

// ======================================
// ROOM SHOWCASE SLIDER
// ======================================
const roomSliderSection = document.querySelector(".room-slider-section");

if (roomSliderSection) {
  const roomSlides = Array.from(roomSliderSection.querySelectorAll(".room-slide"));
  const roomTabs = Array.from(roomSliderSection.querySelectorAll(".room-slider-tab"));
  const dotsWrap = roomSliderSection.querySelector(".room-slider-dots");
  const stage = roomSliderSection.querySelector(".room-slider-stage");

  if (roomSlides.length > 0 && dotsWrap && stage) {
    let activeIndex = roomSlides.findIndex((slide) => slide.classList.contains("is-active"));
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 45;

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    function getWrappedIndex(index) {
      const total = roomSlides.length;
      return (index + total) % total;
    }

    function getRelativePosition(index) {
      const total = roomSlides.length;
      const rawOffset = index - activeIndex;
      const wrappedOffset = ((rawOffset + total) % total + total) % total;
      return wrappedOffset > total / 2 ? wrappedOffset - total : wrappedOffset;
    }

    function buildDots() {
      roomSlides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "room-slider-dot";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => {
          setActive(i);
          restartAuto();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function updateClasses() {
      const dots = Array.from(dotsWrap.querySelectorAll(".room-slider-dot"));

      roomSlides.forEach((slide, index) => {
        const rel = getRelativePosition(index);
        slide.classList.remove("is-active", "is-prev", "is-next", "is-far-left", "is-far-right");

        if (rel === 0) {
          slide.classList.add("is-active");
          slide.setAttribute("aria-hidden", "false");
        } else if (rel === -1) {
          slide.classList.add("is-prev");
          slide.setAttribute("aria-hidden", "true");
        } else if (rel === 1) {
          slide.classList.add("is-next");
          slide.setAttribute("aria-hidden", "true");
        } else if (rel < 0) {
          slide.classList.add("is-far-left");
          slide.setAttribute("aria-hidden", "true");
        } else {
          slide.classList.add("is-far-right");
          slide.setAttribute("aria-hidden", "true");
        }
      });

      roomTabs.forEach((tab, index) => {
        const isActive = index === activeIndex;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      const activeTab = roomTabs[activeIndex];
      if (activeTab && window.innerWidth <= 767) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === activeIndex);
      });
    }

    function setActive(index) {
      activeIndex = getWrappedIndex(index);
      updateClasses();
    }

    function nextSlide() {
      setActive(activeIndex + 1);
    }

    function prevSlide() {
      setActive(activeIndex - 1);
    }

    function startAuto() {
      autoTimer = setInterval(nextSlide, 3500);
    }

    function stopAuto() {
      if (!autoTimer) return;
      clearInterval(autoTimer);
      autoTimer = null;
    }

    function restartAuto() {
      stopAuto();
      startAuto();
    }

    roomTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const index = Number(tab.dataset.slide);
        if (Number.isNaN(index)) return;
        setActive(index);
        restartAuto();
      });
    });

    roomSlides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (index === activeIndex) return;
        setActive(index);
        restartAuto();
      });
    });

    stage.addEventListener("mouseenter", stopAuto);
    stage.addEventListener("mouseleave", startAuto);

    stage.addEventListener(
      "touchstart",
      (event) => {
        if (!event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchEndX = touchStartX;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchmove",
      (event) => {
        if (!event.touches.length) return;
        touchEndX = event.touches[0].clientX;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      () => {
        const distance = touchStartX - touchEndX;
        if (Math.abs(distance) < SWIPE_THRESHOLD) return;
        if (distance > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        restartAuto();
      },
      { passive: true }
    );

    buildDots();
    updateClasses();
    startAuto();
  }
}




document.querySelectorAll('.nav-main-menu > li.has-mega > a').forEach(link => {
  link.addEventListener('click', function (e) {

    // tablet + mobile only
    if (window.innerWidth <= 1024) {
      e.preventDefault();

      const parent = this.parentElement;

      // close others (optional)
      document.querySelectorAll('.nav-main-menu > li.has-mega').forEach(item => {
        if (item !== parent) {
          item.classList.remove('open');
        }
      });

      // toggle current
      parent.classList.toggle('open');
    }
  });
});






// const form = document.getElementById("jobForm");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const formData = {
//     name: form.querySelectorAll("input")[0].value,
//     email: form.querySelectorAll("input")[1].value,
//     mobile: form.querySelectorAll("input")[2].value,
//     city: form.querySelectorAll("input")[3].value,
//     role: form.querySelectorAll("input")[4].value,
//     resume: form.querySelectorAll("input")[5].value,
//     message: form.querySelector("textarea").value,
//   };

//   const response = await fetch("https://script.google.com/macros/s/AKfycbwlHY-kEGbcc5eRMymhXD1JrrXfig_myDIRGRgmEZiYTtakqodipyBpHI3ihweR4GiWGg/exec", {
//     method: "POST",
//     body: JSON.stringify(formData),
//   });

//   const result = await response.json();

//   if (result.result === "success") {
//     alert("Application Submitted Successfully ✅");
//     form.reset();
//   } else {
//     alert("Error ❌");
//   }
// });




// const form = document.getElementById("jobForm");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const formData = new FormData(form);

//   try {
//     const response = await fetch("https://script.google.com/macros/s/AKfycbwlHY-kEGbcc5eRMymhXD1JrrXfig_myDIRGRgmEZiYTtakqodipyBpHI3ihweR4GiWGg/exec", {
//       method: "POST",
//       body: formData
//     });

//     const result = await response.json();

//     if (result.result === "success") {
//       alert("Application Submitted ✅");
//       form.reset();
//     } else {
//       alert("Submission Failed ❌");
//     }

//   } catch (error) {
//     console.error("Error:", error);
//     alert("Something went wrong ❌");
//   }
// });


// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("#form");

//   if (form) {
//     form.addEventListener("submit", function (e) {
//       e.preventDefault(); // 🚨 THIS IS WHAT YOU MISSED

//       alert("Form submitted"); // test first

//       const formData = new FormData(form);

//       try {
//     const response = await fetch("https://script.google.com/macros/s/AKfycbwlHY-kEGbcc5eRMymhXD1JrrXfig_myDIRGRgmEZiYTtakqodipyBpHI3ihweR4GiWGg/exec", {
//       method: "POST",
//       body: formData
//     });

//     const result = await response.json();

//     if (result.result === "success") {
//       alert("Application Submitted ✅");
//       form.reset();
//     } else {
//       alert("Submission Failed ❌");
//     }

//   } catch (error) {
//     console.error("Error:", error);
//     alert("Something went wrong ❌");
//   }

//     });
//   }
// });




 const form = document.querySelector("#form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // 🚨 stop page refresh

      // Get form values
      const formData = new FormData(form);

      // Optional: simple validation
      const name = formData.get("name");
      const email = formData.get("email");

      if (!name || !email) {
        alert("Please fill all required fields");
        return;
      }

      console.log("Submitting form...");

      const scriptURL = "https://script.google.com/macros/s/AKfycbwlHY-kEGbcc5eRMymhXD1JrrXfig_myDIRGRgmEZiYTtakqodipyBpHI3ihweR4GiWGg/exec";

      fetch(scriptURL, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Success:", data);
          alert("Form submitted successfully!");

          form.reset(); // clear form
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong!");
        });
    });
  } else {
    console.warn("Form #careerForm not found");
  }




const subForm = document.getElementById("form1");

subForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = subForm.querySelector("input").value;

  const response = await fetch("https://script.google.com/macros/s/AKfycbwLdDBvdJyKUWr0Z_-m17aabIDsJxXZmpGQxXZXEWiwDMIw4qrQfk2ckULtloj9eu0/exec", {
    method: "POST",
    body: JSON.stringify({
      type: "subscribe",
      email: email
    }),
  });

  const result = await response.json();

  if (result.result === "success") {
    alert("Subscribed Successfully ✅");
    subForm.reset();
  } else {
    alert("Error ❌");
  }
});





//   document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("#form");

//   if (!form) {
//     console.error("Form not found");
//     return;
//   }

//   form.addEventListener("submit", function (e) {
//     e.preventDefault(); // 🚨 STOP redirect

//     const formData = new FormData(form);

//     fetch("https://formsubmit.co/marketingdgrow@gmail.com", {
//       method: "POST",
//       body: formData,
//       headers: {
//         'Accept': 'application/json'
//       }
//     })
//       .then(response => {
//         if (response.ok) {
//           alert("✅ Application submitted successfully!");
//           form.reset();
//         } else {
//           throw new Error("Submission failed");
//         }
//       })
//       .catch(error => {
//         console.error(error);
//         alert("❌ Something went wrong. Try again.");
//       });
//   });
// });