/**
 * VoltPulse EV Network Operator - Core Shared JavaScript
 * Pure Vanilla JS: Dark Mode (#000000), RTL/LTR Persistence, Click-Only Dropdowns, Accessible Drawer, Loader
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initDirection();
  initDesktopDropdown();
  initMobileMenu();
  initScrollToTop();
  initActiveNav();
  initFooterForm();
  initStationLocator();
  initJourneyPlanner();
  initFinderPage();
  initPricingCalculator();
  initContactForm();
  initDashboard();
});

function initDashboard() {
  const bannerInitiateBtn = document.getElementById('banner-initiate-btn');
  const startBtn = document.getElementById('start-new-session-btn');
  const stopBtn = document.getElementById('stop-active-session-btn');
  const quickChargeBtns = document.querySelectorAll('.quick-charge-btn');
  const addPaymentBtn = document.getElementById('add-payment-btn');
  const stationDisplay = document.getElementById('active-station-display');
  const statusTag = document.getElementById('session-status-tag');
  const kwDisplay = document.getElementById('telemetry-kw');
  const kwhDisplay = document.getElementById('telemetry-kwh');
  const socLabel = document.getElementById('soc-percent-label');
  const socFill = document.getElementById('soc-bar-fill');
  const sessionTelemetryState = document.getElementById('session-telemetry-state');

  // Portal Tab Switching Controller (Overview, Locate, Sessions, Payment, RFID)
  const portalNavLinks = document.querySelectorAll('.portal-nav-link');
  const portalTabPanels = document.querySelectorAll('.portal-tab-panel');

  function switchPortalTab(targetTabId) {
    if (!targetTabId) return;

    // 1. Deactivate all tab panels
    portalTabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // 2. Activate target panel
    const targetPanel = document.getElementById(targetTabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Highlight corresponding sidebar button
    portalNavLinks.forEach(link => {
      const linkTab = link.getAttribute('data-tab') || (link.getAttribute('href') || '').replace('#', '');
      if (linkTab === targetTabId) {
        link.classList.add('active');
      } else if (link.getAttribute('data-tab') || (link.getAttribute('href') && link.getAttribute('href').startsWith('#'))) {
        link.classList.remove('active');
      }
    });
  }

  // Bind clicks on sidebar navigation links
  portalNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetTabId = link.getAttribute('data-tab') || (link.getAttribute('href') || '').replace('#', '');
      if (targetTabId && document.getElementById(targetTabId)) {
        e.preventDefault();
        switchPortalTab(targetTabId);
      }
    });
  });

  // Bind any element with data-switch-tab attribute
  document.querySelectorAll('[data-switch-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = el.getAttribute('data-switch-tab');
      switchPortalTab(tabId);
    });
  });

  // Back to overview buttons
  document.querySelectorAll('.portal-back-overview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchPortalTab('tab-content-overview');
    });
  });

  // Initiate from banner
  if (bannerInitiateBtn) {
    bannerInitiateBtn.addEventListener('click', () => {
      switchPortalTab('tab-content-session');
      if (stationDisplay) {
        stationDisplay.textContent = 'I-95 Superhub • Stall 04B (CCS2 / 350 kW)';
      }
      const stationDisplayTab = document.getElementById('active-station-display-tab');
      if (stationDisplayTab) {
        stationDisplayTab.textContent = 'I-95 Superhub • Stall 04B (CCS2 / 350 kW Ultra-Fast)';
      }
      if (statusTag) {
        statusTag.textContent = 'Connected • Charging';
        statusTag.className = 'portal-station-status-tag tag-available';
      }
      alert('Handshake verified via Plug & Charge! 350 kW DC Fast session initiated.');
    });
  }

  // Quick initiate from nearby stations
  quickChargeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stationName = btn.getAttribute('data-station') || 'Selected Station';
      if (stationDisplay) stationDisplay.textContent = stationName;
      const stationDisplayTab = document.getElementById('active-station-display-tab');
      if (stationDisplayTab) stationDisplayTab.textContent = stationName;

      if (statusTag) {
        statusTag.textContent = 'Dispenser Reserved';
        statusTag.className = 'portal-station-status-tag tag-available';
      }
      switchPortalTab('tab-content-session');
    });
  });

  // Start new session (both overview and dedicated tab)
  const startBtns = [startBtn, document.getElementById('start-new-session-btn-tab')].filter(Boolean);
  startBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const allStatusTags = document.querySelectorAll('#session-status-tag, #session-status-tag-tab');
      allStatusTags.forEach(tag => {
        tag.textContent = '350 kW Active Delivery';
        tag.className = 'portal-station-status-tag tag-available';
      });

      const allKw = document.querySelectorAll('#telemetry-kw, #telemetry-kw-tab');
      allKw.forEach(el => el.textContent = '285 kW');

      const allKwh = document.querySelectorAll('#telemetry-kwh, #telemetry-kwh-tab');
      allKwh.forEach(el => el.textContent = '51.4 kWh');

      const allSocLabels = document.querySelectorAll('#soc-percent-label, #soc-percent-label-tab');
      allSocLabels.forEach(el => el.textContent = '82%');

      const allSocFills = document.querySelectorAll('#soc-bar-fill, #soc-bar-fill-tab');
      allSocFills.forEach(el => el.style.width = '82%');

      const allStates = document.querySelectorAll('#session-telemetry-state, #session-telemetry-state-tab');
      allStates.forEach(el => el.textContent = '285 kW Peak');

      alert('High-Power 350 kW session active. Current Delivery: 285 kW.');
    });
  });

  // Stop active session (both overview and dedicated tab)
  const stopBtns = [stopBtn, document.getElementById('stop-active-session-btn-tab')].filter(Boolean);
  stopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const allStatusTags = document.querySelectorAll('#session-status-tag, #session-status-tag-tab');
      allStatusTags.forEach(tag => {
        tag.textContent = 'Session Complete • Unlocked';
        tag.className = 'portal-station-status-tag tag-busy';
      });

      const allKw = document.querySelectorAll('#telemetry-kw, #telemetry-kw-tab');
      allKw.forEach(el => el.textContent = '0 kW');

      const allStates = document.querySelectorAll('#session-telemetry-state, #session-telemetry-state-tab');
      allStates.forEach(el => el.textContent = 'Standby');

      alert('Charging session completed. Dispenser connector unlocked. Digital invoice of $14.32 charged to primary Visa •••• 4821.');
    });
  });

  // Add payment method
  const addPaymentBtns = [addPaymentBtn, document.getElementById('add-payment-btn-tab')].filter(Boolean);
  addPaymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Secure Stripe & Apple Pay payment terminal initialized. Ready to link new debit/credit card.');
    });
  });
}

function initContactForm() {
  const form = document.getElementById('driver-support-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for contacting VoltPulse Operations. A support specialist has received your request.');
    form.reset();
  });
}


function initPricingCalculator() {
  const slider = document.getElementById('calc-kwh-slider');
  const label = document.getElementById('calc-kwh-display');
  const stdPrice = document.getElementById('calc-std-price');
  const plusPrice = document.getElementById('calc-plus-price');
  const savingsPrice = document.getElementById('calc-savings-price');

  if (!slider) return;

  const updateCalc = () => {
    const kwh = parseFloat(slider.value) || 60;
    if (label) label.textContent = `${kwh} kWh`;

    const standardTotal = (kwh * 0.42).toFixed(2);
    const plusTotal = (kwh * 0.31).toFixed(2);
    const savings = (standardTotal - plusTotal).toFixed(2);

    if (stdPrice) stdPrice.textContent = `$${standardTotal}`;
    if (plusPrice) plusPrice.textContent = `$${plusTotal}`;
    if (savingsPrice) savingsPrice.textContent = `Save $${savings}`;
  };

  slider.addEventListener('input', updateCalc);
  updateCalc();
}


function initFinderPage() {
  const filterChips = document.querySelectorAll('.finder-filter-chip');
  const stationItems = document.querySelectorAll('.hub-station-item');
  const searchInput = document.getElementById('finder-search-input');
  const mapFrame = document.getElementById('hub-live-map-frame');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterVal = (chip.getAttribute('data-filter') || '').toLowerCase().trim();
      stationItems.forEach(item => {
        if (!filterVal || filterVal === 'all') {
          item.classList.remove('is-hidden');
        } else {
          const itemType = (item.getAttribute('data-type') || '').toLowerCase();
          const types = itemType.split(/\s+/);
          if (types.includes(filterVal)) {
            item.classList.remove('is-hidden');
          } else {
            item.classList.add('is-hidden');
          }
        }
      });
    });
  });

  stationItems.forEach(item => {
    item.addEventListener('click', () => {
      stationItems.forEach(s => s.classList.remove('active-station'));
      item.classList.add('active-station');

      const query = item.getAttribute('data-query');
      if (mapFrame && query) {
        mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      stationItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  }
}


function initJourneyPlanner() {
  const form = document.getElementById('journey-planner-form');
  if (!form) return;

  const resultTitle = document.getElementById('planner-res-title');
  const resultSub = document.getElementById('planner-res-sub');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const origin = document.getElementById('planner-origin').value || 'Origin';
    const dest = document.getElementById('planner-destination').value || 'Destination';

    if (resultTitle && resultSub) {
      resultTitle.textContent = `Recommended Stop: Mid-Way Superhub (350 kW)`;
      resultSub.textContent = `Optimal 15-minute charge between ${origin} and ${dest}. +240 miles added.`;
    }
  });
}


function initStationLocator() {
  // Station search quick chips
  const chips = document.querySelectorAll('.chip-tag');
  const searchInput = document.querySelector('.hero-search-input');
  const searchForm = document.getElementById('hero-search-form');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = chip.textContent.trim();
        searchInput.focus();
      }
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput ? searchInput.value.trim() : '';
      if (val) {
        window.location.href = `find-charger.html?query=${encodeURIComponent(val)}`;
      } else {
        window.location.href = 'find-charger.html';
      }
    });
  }

  // Filter tabs in Section 2 (Ensuring exactly 3 cards for every filter selection)
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const stationCards = document.querySelectorAll('.station-item-card');

  function applyStationFilter(filterType) {
    stationCards.forEach(card => {
      const cardType = card.getAttribute('data-type') || '';
      const match = filterType === 'all'
        ? cardType.includes('all')
        : cardType.includes(filterType);
      card.style.display = match ? 'flex' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterType = btn.getAttribute('data-filter') || 'all';
      applyStationFilter(filterType);
    });
  });

  // Apply initial 3-card filter on load
  const initialActive = document.querySelector('.filter-tab-btn.active');
  if (initialActive) {
    applyStationFilter(initialActive.getAttribute('data-filter') || 'all');
  }
}



function initFooterForm() {
  const form = document.getElementById('station-alert-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Subscribed to VoltPulse Station Alerts!');
      form.reset();
    });
  }
}


/* -------------------------------------------------------------
 * 1. Branded Preloader
 * ------------------------------------------------------------- */
function initLoader() {
  const loader = document.getElementById('global-loader');
  if (!loader) return;

  const dismissLoader = () => {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.remove();
    }, 450);
  };

  if (document.readyState === 'complete') {
    setTimeout(dismissLoader, 200);
  } else {
    window.addEventListener('load', () => setTimeout(dismissLoader, 200));
  }
}

/* -------------------------------------------------------------
 * 2. Dark Mode System (#000000 Strict Pure Black)
 * ------------------------------------------------------------- */
function initTheme() {
  const THEME_KEY = 'voltpulse_theme_mode';
  const html = document.documentElement;
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');

  // Check saved or system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }

  updateThemeIcons();

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  });

  function updateThemeIcons() {
    const isDark = html.classList.contains('dark');
    toggleButtons.forEach(btn => {
      const sunIcon = btn.querySelector('.theme-sun-icon');
      const moonIcon = btn.querySelector('.theme-moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
}

/* -------------------------------------------------------------
 * 3. RTL / LTR Direction System
 * ------------------------------------------------------------- */
function initDirection() {
  const DIR_KEY = 'voltpulse_text_dir';
  const html = document.documentElement;
  const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');

  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  html.setAttribute('dir', savedDir);
  updateDirLabels(savedDir);

  rtlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = html.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      html.setAttribute('dir', newDir);
      localStorage.setItem(DIR_KEY, newDir);
      updateDirLabels(newDir);
    });
  });

  function updateDirLabels(dir) {
    rtlButtons.forEach(btn => {
      const label = btn.querySelector('.rtl-text-indicator');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
    });
  }
}

/* -------------------------------------------------------------
 * 4. Desktop Navigation - Strict CLICK ONLY Dropdown
 * ------------------------------------------------------------- */
function initDesktopDropdown() {
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');

  dropdownWrappers.forEach(wrapper => {
    const toggleBtn = wrapper.querySelector('.dropdown-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = wrapper.classList.contains('open');

      // Close all other dropdowns
      dropdownWrappers.forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('open');
          const btn = w.querySelector('.dropdown-toggle-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        wrapper.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        wrapper.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-wrapper')) {
      dropdownWrappers.forEach(w => {
        w.classList.remove('open');
        const btn = w.querySelector('.dropdown-toggle-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownWrappers.forEach(w => {
        w.classList.remove('open');
        const btn = w.querySelector('.dropdown-toggle-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* -------------------------------------------------------------
 * 5. Mobile Drawer Menu & Accordion
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const overlay = document.getElementById('mobile-drawer-overlay');
  const drawer = document.getElementById('mobile-drawer');

  if (!drawer) return;

  const accordionWrapper = drawer.querySelector('.mobile-accordion-wrapper');
  const accordionToggle = drawer.querySelector('.mobile-accordion-toggle');

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    // Ensure accordion is closed by default unless user clicks it
    if (accordionWrapper) {
      accordionWrapper.classList.remove('open');
    }
    if (accordionToggle) {
      accordionToggle.setAttribute('aria-expanded', 'false');
    }
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    // Ensure accordion resets to closed automatically
    if (accordionWrapper) {
      accordionWrapper.classList.remove('open');
    }
    if (accordionToggle) {
      accordionToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Close drawer on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Mobile Accordion (Click only — opens only when clicked, otherwise automatic closed)
  if (accordionWrapper && accordionToggle) {
    accordionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      accordionWrapper.classList.toggle('open');
      const isOpen = accordionWrapper.classList.contains('open');
      accordionToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close menu when clicking ANY navigation link (including Home 1 and Home 2)
  const allNavLinks = drawer.querySelectorAll('a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* -------------------------------------------------------------
 * 6. Scroll-To-Top Button
 * ------------------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------
 * 7. Active Navigation State Detection
 * ------------------------------------------------------------- */
function initActiveNav() {
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPath || currentPath === '') currentPath = 'index.html';

  // Clear previous active states to guarantee only current page is highlighted
  const allNavElements = document.querySelectorAll('.nav-link, .dropdown-item-link, .dropdown-toggle-btn, .mobile-nav-link, .mobile-sub-link, .mobile-accordion-toggle');
  allNavElements.forEach(el => el.classList.remove('active'));

  const links = document.querySelectorAll('.nav-link, .dropdown-item-link, .mobile-nav-link, .mobile-sub-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetFile = href.split('/').pop();

    if (targetFile === currentPath || (currentPath === '' && targetFile === 'index.html')) {
      link.classList.add('active');

      // If active inside desktop dropdown, mark parent toggle as active
      const parentDropdown = link.closest('.nav-dropdown-wrapper');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.dropdown-toggle-btn');
        if (toggle) toggle.classList.add('active');
      }

      // If active inside mobile accordion (Home 1 or Home 2), mark the Home Variations button active
      // NOTE: Do NOT open the accordion automatically! It stays closed unless user clicks it.
      const parentAccordion = link.closest('.mobile-accordion-wrapper');
      if (parentAccordion) {
        const toggle = parentAccordion.querySelector('.mobile-accordion-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });
}
