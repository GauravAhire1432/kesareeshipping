(function () {
  'use strict';

  /* ── Page Loader ── */
  var loader = document.getElementById('page-loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
    }, 1000);
  });

  /* ── Navbar Scroll ── */
  var navbar = document.querySelector('.navbar-ref');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Active Nav Link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-ref .nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Counter Animation ── */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var start = performance.now();
    function update(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  /* ── Services Carousel ── */
  var track = document.getElementById('svcTrack');
  var prevBtn = document.getElementById('svcPrev');
  var nextBtn = document.getElementById('svcNext');
  var dotsContainer = document.getElementById('svcDots');

  if (track && prevBtn && nextBtn) {
    var cards = track.querySelectorAll('.service-slant-card');
    var currentIndex = 0;
    var visibleCount = 3;

    function getVisibleCount() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function getMaxIndex() {
      visibleCount = getVisibleCount();
      return Math.max(0, cards.length - visibleCount);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      var maxIdx = getMaxIndex();
      for (var i = 0; i <= maxIdx; i++) {
        var dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        if (i === currentIndex) dot.classList.add('active');
        (function (idx) {
          dot.addEventListener('click', function () { goTo(idx); });
        })(i);
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      visibleCount = getVisibleCount();
      var cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
      if (dotsContainer) {
        dotsContainer.querySelectorAll('button').forEach(function (d, i) {
          d.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      updateCarousel();
    }

    prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });
    window.addEventListener('resize', function () {
      buildDots();
      goTo(Math.min(currentIndex, getMaxIndex()));
    });
    buildDots();
    updateCarousel();
  }

  /* ── About Image Slider (auto + manual) ── */
  var aboutDots = document.getElementById('aboutDots');
  var aboutSlides = document.querySelectorAll('.about-slide');
  var aboutCurrent = 0;

  function showAboutSlide(index) {
    if (!aboutSlides.length) return;
    aboutCurrent = index;
    aboutSlides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
    if (aboutDots) {
      aboutDots.querySelectorAll('span').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
  }

  if (aboutSlides.length) {
    if (aboutDots) {
      aboutDots.querySelectorAll('span').forEach(function (dot) {
        dot.addEventListener('click', function () {
          showAboutSlide(parseInt(dot.getAttribute('data-index'), 10));
        });
      });
    }
    setInterval(function () {
      showAboutSlide((aboutCurrent + 1) % aboutSlides.length);
    }, 4500);
  }

  /* ── Efficiency Video Player ── */
  var efficiencyPlayBtn = document.getElementById('efficiencyPlayBtn');
  var efficiencyVideo = document.getElementById('efficiencyVideo');
  var efficiencyOverlay = document.getElementById('efficiencyPlayOverlay');
  var videoModal = document.getElementById('videoModal');
  var videoModalClose = document.getElementById('videoModalClose');
  var videoModalBackdrop = document.getElementById('videoModalBackdrop');
  var efficiencyVideoModal = document.getElementById('efficiencyVideoModal');

  function openVideoModal() {
    if (!videoModal) return;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (efficiencyVideoModal) {
      efficiencyVideoModal.currentTime = 0;
      efficiencyVideoModal.play();
    }
    if (efficiencyVideo) efficiencyVideo.pause();
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (efficiencyVideoModal) {
      efficiencyVideoModal.pause();
    }
  }

  if (efficiencyPlayBtn) {
    efficiencyPlayBtn.addEventListener('click', function () {
      openVideoModal();
    });
  }

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideoModal();
  });

  /* ── Contact Form → WhatsApp Integration ── */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {

    /**
     * showError – display an inline error message below a field.
     * @param {string} fieldId  – the id of the input/select/textarea
     * @param {string} message  – error text to display (empty string clears it)
     */
    function showError(fieldId, message) {
      var errEl = document.getElementById('err-' + fieldId);
      var field = document.getElementById(fieldId);
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = message ? 'block' : 'none';
      }
      if (field) {
        field.classList.toggle('field-invalid', !!message);
      }
    }

    /**
     * validateForm – validate all required fields.
     * Returns true if the form is valid, false otherwise.
     */
    function validateForm() {
      var isValid = true;

      /* ── Full Name ── */
      var fullName = document.getElementById('fullName').value.trim();
      if (!fullName) {
        showError('fullName', 'Full Name is required.');
        isValid = false;
      } else {
        showError('fullName', '');
      }

      /* ── Subject ── */
      var subject = document.getElementById('subject').value.trim();
      if (!subject) {
        showError('subject', 'Subject is required.');
        isValid = false;
      } else {
        showError('subject', '');
      }

      /* ── Email ── */
      var email = document.getElementById('email').value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        showError('email', 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
      } else {
        showError('email', '');
      }

      /* ── Service Required ── */
      var service = document.getElementById('service').value;
      if (!service) {
        showError('service', 'Please select a service.');
        isValid = false;
      } else {
        showError('service', '');
      }

      /* ── Message ── */
      var message = document.getElementById('message').value.trim();
      if (!message) {
        showError('message', 'Message is required.');
        isValid = false;
      } else {
        showError('message', '');
      }

      return isValid;
    }

    /* ── Clear field error as soon as the user starts typing / changing ── */
    ['fullName', 'subject', 'email', 'service', 'message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { showError(id, ''); });
        el.addEventListener('change', function () { showError(id, ''); });
      }
    });

    /* ── Form Submit Handler ── */
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Run validation; abort if any field is invalid */
      if (!validateForm()) return;

      /* ── Collect field values ── */
      var fullName = document.getElementById('fullName').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var email = document.getElementById('email').value.trim();
      var service = document.getElementById('service').value;
      var message = document.getElementById('message').value.trim();

      /* ── Build the WhatsApp message ── */
      var whatsappMsg =
        '*New Contact Form Submission*\n\n' +
        '👤 Full Name: ' + fullName + '\n' +
        '📌 Subject: ' + subject + '\n' +
        '📧 Email: ' + email + '\n' +
        '🛠 Service Required: ' + service + '\n' +
        '💬 Message:\n' + message;

      /* ── Encode and open WhatsApp ── */
      var encodedMsg = encodeURIComponent(whatsappMsg);
      var whatsappUrl = 'https://wa.me/917875918325?text=' + encodedMsg;

      /*
       * window.open is used so browsers don't treat it as a popup blocker target.
       * '_blank' allows WhatsApp Web to open in a new tab / the WhatsApp app on mobile.
       */
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      /* ── Reset form and show success banner ── */
      contactForm.reset();

      var successEl = document.getElementById('formSuccess');
      if (successEl) {
        successEl.style.display = 'block';
        /* Auto-hide after 6 seconds */
        setTimeout(function () {
          successEl.style.display = 'none';
        }, 6000);
      }
    });
  }

  /* ── Stagger delays ── */
  document.querySelectorAll('.why-card.reveal, .why-grid-item.reveal').forEach(function (item, i) {
    item.style.transitionDelay = i * 0.08 + 's';
  });

  /* ── About Hero Image Slider ── */
  var aboutHeroImgs = document.querySelectorAll('.about-hero-img');
  if (aboutHeroImgs.length > 1) {
    var aboutHeroIdx = 0;
    setInterval(function () {
      aboutHeroImgs[aboutHeroIdx].classList.remove('active');
      aboutHeroIdx = (aboutHeroIdx + 1) % aboutHeroImgs.length;
      aboutHeroImgs[aboutHeroIdx].classList.add('active');
    }, 5000);
  }

  /* ── About Vision Stack Cards ── */
  var visionStack = document.getElementById('visionStack');
  if (visionStack) {
    var visionCards = visionStack.querySelectorAll('.vision-stack-card');
    visionCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        visionCards.forEach(function (c) { c.classList.remove('active'); });
        card.classList.add('active');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('active');
      });
    });
  }

  /* ── Services Page Hero & Nav ── */
  var serviceHero = document.getElementById('serviceHero');
  if (serviceHero) {
    var svcTitleOrange = document.getElementById('svcTitleOrange');
    var svcTitleNavy = document.getElementById('svcTitleNavy');
    var svcSubtitle = document.getElementById('svcSubtitle');
    var svcNavItems = document.querySelectorAll('.svc-nav-item');
    var svcSections = document.querySelectorAll('.svc-detail-section[data-service]');

    var svcData = {
      default: { orange: 'Logistics', navy: 'Services', sub: 'Collaboration To Deliver Success' },
      customs: { orange: 'Customs', navy: 'Clearance', sub: 'Smooth Documentation For Global Trade' },
      freight: { orange: 'Freight', navy: 'Forwarding', sub: 'Global Cargo Movement Made Simple' },
      transport: { orange: 'Transportation', navy: 'Services', sub: 'Reliable Delivery With Own Fleet' },
      incentives: { orange: 'Export', navy: 'Incentives', sub: 'Maximize Benefits, Stay Compliant' }
    };

    function setServiceHero(key) {
      var data = svcData[key] || svcData.default;
      if (svcTitleOrange) svcTitleOrange.textContent = data.orange;
      if (svcTitleNavy) svcTitleNavy.textContent = data.navy;
      if (svcSubtitle) svcSubtitle.textContent = data.sub;
      svcNavItems.forEach(function (item) {
        item.classList.toggle('active', item.getAttribute('data-service') === key);
      });
    }

    svcNavItems.forEach(function (item) {
      item.addEventListener('click', function () {
        setServiceHero(item.getAttribute('data-service'));
      });
    });

    if (svcSections.length && 'IntersectionObserver' in window) {
      var svcObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setServiceHero(entry.target.getAttribute('data-service'));
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
      svcSections.forEach(function (sec) { svcObserver.observe(sec); });
    }

    if (window.location.hash) {
      var hashKey = window.location.hash.replace('#', '');
      if (svcData[hashKey]) setServiceHero(hashKey);
    }
  }

  /* ── Contact card stagger ── */
  document.querySelectorAll('.contact-slant-card.reveal').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.15) + 's';
    card.style.animationDelay = (i * 0.15) + 's';
  });

  /* ── About page stagger ── */
  document.querySelectorAll('.team-card.reveal, .why-mini.reveal, .vision-stack-card, .svc-hub-box.reveal').forEach(function (item, i) {
    if (item.classList.contains('reveal')) {
      item.style.transitionDelay = (i % 8) * 0.08 + 's';
    }
  });
})();
