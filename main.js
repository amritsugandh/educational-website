/**
 * ============================================================
 *  main.js — Maths Point · Global JavaScript
 *  Handles: Hamburger, Scroll Reveal, Navbar, Toast,
 *           Forms, Counters, Smooth Scroll, Back-to-Top,
 *           Active Nav, Page Loader, Notifications
 * ============================================================
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. PAGE LOADER
  ───────────────────────────────────────────── */
  function initLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;
    function hideLoader() {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(function () { if (loader.parentNode) loader.remove(); }, 500);
    }
    // Hide immediately after DOM ready — never wait more than 600ms
    var timer = setTimeout(hideLoader, 600);
    window.addEventListener('load', function () {
      clearTimeout(timer);
      hideLoader();
    });
  }

  /* ─────────────────────────────────────────────
     2. HAMBURGER / MOBILE DRAWER
  ───────────────────────────────────────────── */
  function initHamburger() {
    var btn     = document.getElementById('hamburger');
    var drawer  = document.getElementById('mobileDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var closeBtn= document.getElementById('drawerClose');
    if (!btn || !drawer) return;

    function openDrawer() {
      drawer.classList.add('open');
      btn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay)  overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ─────────────────────────────────────────────
     3. STICKY NAVBAR — shrink + shadow on scroll
  ───────────────────────────────────────────── */
  function initNavbar() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 60) {
        nav.style.padding        = '0.75rem 5%';
        nav.style.boxShadow      = '0 4px 24px rgba(0,0,0,0.4)';
        nav.style.background     = 'rgba(10,22,40,0.98)';
      } else {
        nav.style.padding        = '1.2rem 5%';
        nav.style.boxShadow      = 'none';
        nav.style.background     = 'rgba(10,22,40,0.9)';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────────
     4. ACTIVE NAV LINK — highlight current page
  ───────────────────────────────────────────── */
  function initActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .drawer-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href === current) a.classList.add('active');
    });
  }

  /* ─────────────────────────────────────────────
     5. SCROLL REVEAL — fade-up on enter viewport
  ───────────────────────────────────────────── */
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, Math.min(i * 80, 400));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      els.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback for old browsers
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ─────────────────────────────────────────────
     6. ANIMATED COUNTERS — count up on visibility
  ───────────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
    var suffix = el.dataset.suffix || el.textContent.replace(/[0-9.]/g, '');
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = target < 10 ? (eased * target).toFixed(1) : Math.floor(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-num, .strip-num, .ov-num');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Store original text as data attributes
          if (!el.dataset.target) {
            var raw = el.textContent;
            el.dataset.target = raw.replace(/[^0-9.]/g, '');
            el.dataset.suffix = raw.replace(/[0-9.]/g, '');
          }
          animateCounter(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ─────────────────────────────────────────────
     7. TOAST NOTIFICATION SYSTEM
  ───────────────────────────────────────────── */
  window.showToast = function (msg, type) {
    var existing = document.getElementById('globalToast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'globalToast';
    var bg = type === 'error'
      ? 'linear-gradient(135deg,#e87f7f,#c94b4b)'
      : type === 'info'
      ? 'linear-gradient(135deg,#4fa3e0,#9b7fe8)'
      : 'linear-gradient(135deg,#3ecf8e,#4fa3e0)';

    toast.style.cssText = [
      'position:fixed','bottom:2rem','right:2rem','z-index:9999',
      'background:' + bg,
      'color:#fff','border-radius:12px','padding:1rem 1.5rem',
      'font-size:0.92rem','font-weight:600','font-family:"DM Sans",sans-serif',
      'box-shadow:0 8px 30px rgba(0,0,0,0.3)',
      'transform:translateY(20px)','opacity:0',
      'transition:transform 0.3s ease,opacity 0.3s ease',
      'max-width:340px','line-height:1.4',
    ].join(';');
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity   = '1';
    });
    setTimeout(function () {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity   = '0';
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  };

  /* ─────────────────────────────────────────────
     8. FORM HANDLING — Contact, Enroll, Testimonial
  ───────────────────────────────────────────── */
  function initForms() {

    // Generic form validator
    function validateForm(form) {
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var wrapper = field.closest('.form-group');
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e87f7f';
          field.style.boxShadow   = '0 0 0 3px rgba(232,127,127,0.15)';
          if (wrapper && !wrapper.querySelector('.field-error')) {
            var err = document.createElement('span');
            err.className = 'field-error';
            err.textContent = 'This field is required';
            err.style.cssText = 'color:#e87f7f;font-size:0.75rem;margin-top:0.3rem;display:block;';
            wrapper.appendChild(err);
          }
        } else {
          field.style.borderColor = 'rgba(62,207,142,0.5)';
          field.style.boxShadow   = '0 0 0 3px rgba(62,207,142,0.1)';
          if (wrapper) {
            var existingErr = wrapper.querySelector('.field-error');
            if (existingErr) existingErr.remove();
          }
        }
      });
      // Phone validation
      var phone = form.querySelector('input[type="tel"]');
      if (phone && phone.value.trim()) {
        var digits = phone.value.replace(/\D/g, '');
        if (digits.length < 10) {
          valid = false;
          phone.style.borderColor = '#e87f7f';
          showToast('Please enter a valid 10-digit phone number.', 'error');
        }
      }
      // Email validation
      var email = form.querySelector('input[type="email"]');
      if (email && email.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          valid = false;
          email.style.borderColor = '#e87f7f';
          showToast('Please enter a valid email address.', 'error');
        }
      }
      return valid;
    }

    function resetBtn(btn, originalHTML) {
      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }

    // Contact form
    var contactForm = document.querySelector('.form-body form, #contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(contactForm)) return;
        var btn = contactForm.querySelector('.btn-submit');
        var orig = btn.innerHTML;
        btn.innerHTML = '✅ Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#3ecf8e,#4fa3e0)';
        btn.disabled = true;
        showToast('✅ Your message has been sent! We\'ll reply within 24 hours.');
        contactForm.reset();
        contactForm.querySelectorAll('input,select,textarea').forEach(function(f){
          f.style.borderColor = '';
          f.style.boxShadow   = '';
        });
        resetBtn(btn, orig);
      });
    }

    // Enrollment form
    var enrollForm = document.querySelector('.enroll-right form, #enrollForm');
    if (enrollForm) {
      enrollForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(enrollForm)) return;
        var btn = enrollForm.querySelector('.btn-submit');
        var orig = btn.innerHTML || btn.textContent;
        btn.textContent = '✅ Registration Submitted!';
        btn.style.background = 'linear-gradient(135deg,#3ecf8e,#4fa3e0)';
        btn.disabled = true;
        showToast('🎉 Registration received! Mr. Singh will call you within 24 hours.', 'success');
        enrollForm.reset();
        enrollForm.querySelectorAll('input,select,textarea').forEach(function(f){
          f.style.borderColor = '';
          f.style.boxShadow   = '';
        });
        resetBtn(btn, orig);
      });
    }

    // Testimonial submit form
    var testForm = document.querySelector('.submit-form form, #testimonialForm');
    if (testForm) {
      testForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm(testForm)) return;
        var btn = testForm.querySelector('.btn-submit');
        var orig = btn.textContent;
        btn.textContent = '✅ Submitted for Review!';
        btn.style.background = 'linear-gradient(135deg,#3ecf8e,#4fa3e0)';
        btn.disabled = true;
        showToast('⭐ Thank you! Your testimonial has been submitted for review.');
        testForm.reset();
        resetBtn(btn, orig);
      });
    }

    // Real-time input feedback — clear errors on typing
    document.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.style.borderColor = '';
          field.style.boxShadow   = '';
          var err = field.closest('.form-group') && field.closest('.form-group').querySelector('.field-error');
          if (err) err.remove();
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     9. SMOOTH SCROLL for anchor links
  ───────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var navH = (document.querySelector('nav') || {}).offsetHeight || 80;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ─────────────────────────────────────────────
     10. BACK TO TOP BUTTON
  ───────────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '↑';
    btn.title = 'Back to top';
    btn.style.cssText = [
      'position:fixed','bottom:2rem','left:2rem','z-index:500',
      'width:44px','height:44px','border-radius:50%',
      'background:linear-gradient(135deg,#c9a94b,#e8c96d)',
      'color:#0a1628','font-size:1.2rem','font-weight:700',
      'border:none','cursor:pointer',
      'box-shadow:0 6px 20px rgba(201,169,75,0.35)',
      'opacity:0','transform:translateY(10px)',
      'transition:opacity 0.3s,transform 0.3s',
      'display:flex','align-items:center','justify-content:center',
    ].join(';');
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.style.opacity   = '1';
        btn.style.transform = 'translateY(0)';
      } else {
        btn.style.opacity   = '0';
        btn.style.transform = 'translateY(10px)';
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     11. COURSE FILTER (courses.html)
  ───────────────────────────────────────────── */
  function initCourseFilter() {
    var btns  = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.course-card');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        cards.forEach(function (card) {
          var cat = card.dataset.cat || '';
          var show = filter === 'all' || cat.includes(filter);
          card.style.display = show ? 'flex' : 'none';
          if (show) {
            card.style.animation = 'none';
            requestAnimationFrame(function () {
              card.style.animation = 'fadeUp 0.4s ease both';
            });
          }
        });
        showToast('Showing ' + (filter === 'all' ? 'all programs' : filter + ' programs'), 'info');
      });
    });
  }

  /* ─────────────────────────────────────────────
     12. CAROUSEL (testimonials.html)
  ───────────────────────────────────────────── */
  function initCarousel() {
    var track = document.getElementById('carouselTrack');
    if (!track) return;

    var cards     = track.querySelectorAll('.testimonial-card');
    var dotsWrap  = document.getElementById('carouselDots');
    var prevBtn   = document.getElementById('prevBtn');
    var nextBtn   = document.getElementById('nextBtn');
    var current   = 0;
    var autoTimer = null;

    function getVisible() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var total = Math.ceil(cards.length / getVisible());
      for (var i = 0; i < total; i++) {
        (function (idx) {
          var d = document.createElement('button');
          d.className = 'dot' + (idx === 0 ? ' active' : '');
          d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;cursor:pointer;padding:0;transition:background 0.2s,transform 0.2s;';
          d.addEventListener('click', function () { goTo(idx); });
          dotsWrap.appendChild(d);
        })(i);
      }
    }

    function goTo(index) {
      var vis   = getVisible();
      var total = Math.ceil(cards.length / vis);
      current   = ((index % total) + total) % total;
      var gap       = 24;
      var cardWidth = cards[0] ? cards[0].offsetWidth + gap : 0;
      track.style.transform = 'translateX(-' + (current * vis * cardWidth) + 'px)';
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.dot').forEach(function (d, i) {
          d.style.background = i === current ? '#c9a94b' : 'rgba(255,255,255,0.15)';
          d.style.transform  = i === current ? 'scale(1.3)' : 'scale(1)';
        });
      }
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });

    // Touch/swipe support
    var touchStart = 0;
    track.addEventListener('touchstart', function (e) { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    window.addEventListener('resize', function () { buildDots(); goTo(0); });
    buildDots();
    startAuto();
  }

  /* ─────────────────────────────────────────────
     13. PAYMENT OPTION TOGGLE (courses.html)
  ───────────────────────────────────────────── */
  function initPaymentOptions() {
    var opts = document.querySelectorAll('.pay-opt');
    if (!opts.length) return;
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
      });
    });
  }

  /* ─────────────────────────────────────────────
     14. SYLLABUS MODALS (courses.html)
  ───────────────────────────────────────────── */
  function initModals() {
    window.openModal = function (name) {
      var m = document.getElementById('modal-' + name);
      if (m) {
        m.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    };
    window.closeModal = function (name) {
      var m = document.getElementById('modal-' + name);
      if (m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
      }
    };
    document.querySelectorAll('.modal-bg').forEach(function (bg) {
      bg.addEventListener('click', function (e) {
        if (e.target === bg) {
          bg.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-bg.open').forEach(function (m) {
          m.classList.remove('open');
        });
        document.body.style.overflow = '';
      }
    });
  }

  /* ─────────────────────────────────────────────
     15. STAR RATING INTERACTION (testimonials.html)
  ───────────────────────────────────────────── */
  function initStarRating() {
    var labels = document.querySelectorAll('.star-rating label');
    labels.forEach(function (lbl) {
      lbl.addEventListener('mouseenter', function () {
        var idx = Array.from(labels).indexOf(lbl);
        labels.forEach(function (l, i) {
          l.style.color = i >= idx ? '#c9a94b' : 'rgba(255,255,255,0.2)';
        });
      });
      lbl.addEventListener('mouseleave', function () {
        labels.forEach(function (l) { l.style.color = ''; });
      });
    });
  }

  /* ─────────────────────────────────────────────
     16. COPY CONTACT DETAILS on click
  ───────────────────────────────────────────── */
  function initCopyOnClick() {
    document.querySelectorAll('.cc-value').forEach(function (el) {
      var card = el.closest('.contact-card');
      if (!card) return;
      card.style.cursor = 'pointer';
      card.title = 'Click to copy';
      card.addEventListener('click', function () {
        var text = el.textContent.trim();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            showToast('📋 Copied: ' + text, 'info');
          });
        } else {
          // Fallback
          var ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          showToast('📋 Copied: ' + text, 'info');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────
     17. NAV PROGRESS BAR — reading progress
  ───────────────────────────────────────────── */
  function initProgressBar() {
    var bar = document.createElement('div');
    bar.style.cssText = [
      'position:fixed','top:0','left:0','height:3px','z-index:9999',
      'background:linear-gradient(90deg,#c9a94b,#e8c96d)',
      'width:0%','transition:width 0.1s linear',
    ].join(';');
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrolled  = window.scrollY;
      var total     = document.documentElement.scrollHeight - window.innerHeight;
      var pct       = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────
     18. GALLERY PHOTO LIGHTBOX (about.html)
  ───────────────────────────────────────────── */
  function initGallery() {
    var items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var label = (item.querySelector('.gallery-overlay span') || {}).textContent || 'Gallery';
        showToast('📸 ' + label + ' — Add your real photo here!', 'info');
      });
    });
  }

  /* ─────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────── */
  function init() {
    initLoader();
    initHamburger();
    initNavbar();
    initActiveNav();
    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initBackToTop();
    initCourseFilter();
    initCarousel();
    initPaymentOptions();
    initModals();
    initForms();
    initStarRating();
    initCopyOnClick();
    initProgressBar();
    initGallery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
