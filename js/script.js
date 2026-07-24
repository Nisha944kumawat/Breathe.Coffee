"use strict";

/* UPDATE THESE DETAILS BEFORE PUBLISHING */
const CAFE = {
  phone: "+9199928060497",
  phoneDisplay: "+91 99928 060497",
  whatsapp: "9199928060497",
  email: "Breathecoffee012@gmail.com",
  map: "https://maps.app.goo.gl/9Lmezxs7jw6hjBDj7"
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const menuOverlay = document.getElementById("menuOverlay");
  const backTop = document.getElementById("backTop");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  document.querySelectorAll("[data-phone-link]").forEach(el => el.href = `tel:${CAFE.phone}`);
  document.querySelectorAll("[data-phone-text]").forEach(el => el.textContent = CAFE.phoneDisplay);
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    el.href = `https://wa.me/${CAFE.whatsapp}?text=${encodeURIComponent("Hello Breathe.Coffee, I would like to know more.")}`;
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-email-link]").forEach(el => el.href = `mailto:${CAFE.email}`);
  document.querySelectorAll("[data-email-text]").forEach(el => el.textContent = CAFE.email);
  document.querySelectorAll("[data-map-link]").forEach(el => el.href = CAFE.map);
  document.getElementById("year").textContent = new Date().getFullYear();

  const openMenu = () => {
    menu.classList.add("open");
    menuOverlay.classList.add("show");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    menu.classList.remove("open");
    menuOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 25);
    backTop.classList.toggle("show", window.scrollY > 600);
    let current = "home";
    document.querySelectorAll("main section[id]").forEach(section => {
      if (window.scrollY >= section.offsetTop - 180) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      document.querySelectorAll(".faq-item.active").forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove("active");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("active");
      answer.style.maxHeight = item.classList.contains("active") ? `${answer.scrollHeight}px` : null;
    });
  });
  const firstAnswer = document.querySelector(".faq-item.active .faq-answer");
  if (firstAnswer) firstAnswer.style.maxHeight = `${firstAnswer.scrollHeight}px`;

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
  };
  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      lightboxImage.src = item.dataset.full;
      lightbox.classList.add("open");
      document.body.classList.add("lightbox-open");
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  const track = document.getElementById("testimonialTrack");
  const cards = [...track.children];
  const dotsWrap = document.getElementById("sliderDots");
  let slide = 0;
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to review ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dotsWrap.appendChild(dot);
  });
  const dots = [...dotsWrap.children];
  const goToSlide = index => {
    slide = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${slide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === slide));
  };
  document.getElementById("prevTestimonial").addEventListener("click", () => goToSlide(slide - 1));
  document.getElementById("nextTestimonial").addEventListener("click", () => goToSlide(slide + 1));
  goToSlide(0);
  let autoSlide = setInterval(() => goToSlide(slide + 1), 5500);
  document.querySelector(".testimonial-slider").addEventListener("mouseenter", () => clearInterval(autoSlide));
  document.querySelector(".testimonial-slider").addEventListener("mouseleave", () => autoSlide = setInterval(() => goToSlide(slide + 1), 5500));

  const dateInput = document.getElementById("date");
  dateInput.min = new Date().toISOString().split("T")[0];
  document.getElementById("whatsappForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Hello Breathe.Coffee, I would like to request a table reservation.",
      "",
      `Name: ${form.get("name")}`,
      `Phone: ${form.get("phone")}`,
      `Visit Date: ${form.get("date")}`,
      `Preferred Time: ${form.get("time")}`,
      `Guests: ${form.get("guests")}`,
      `Occasion: ${form.get("occasion")}`,
      `Special Request: ${form.get("message") || "None"}`
    ].join("\n");
    window.open(`https://wa.me/${CAFE.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
});

window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("preloader").classList.add("hide"), 350);
});
