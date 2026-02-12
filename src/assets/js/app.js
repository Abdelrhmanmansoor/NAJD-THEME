/**
 * Najd Theme — Main JS
 * Clean, modular, zero spaghetti
 */

// ═══════════════════════════════════════════
// Module: Header (sticky + mobile menu)
// ═══════════════════════════════════════════
const HeaderModule = (() => {
  const SCROLL_THRESHOLD = 50;
  let header, mobileMenu, menuBtn, closeBtn, searchBtn, searchModal, searchClose;

  function init() {
    header = document.getElementById('najd-header');
    mobileMenu = document.getElementById('mobile-menu');
    menuBtn = document.getElementById('mobile-menu-btn');
    closeBtn = document.getElementById('mobile-menu-close');
    searchBtn = document.getElementById('search-btn');
    searchModal = document.getElementById('search-modal');
    searchClose = document.getElementById('search-close');
    if (!header) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    menuBtn?.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
    searchBtn?.addEventListener('click', () => toggleSearch(true));
    searchClose?.addEventListener('click', () => toggleSearch(false));
  }

  function handleScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  function toggleMenu(open) {
    mobileMenu?.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  }

  function toggleSearch(open) {
    searchModal?.classList.toggle('is-open', open);
  }

  return { init };
})();

// ═══════════════════════════════════════════
// Module: Announcement Bar (scroll ticker)
// ═══════════════════════════════════════════
const AnnounceModule = (() => {
  function init() {
    const track = document.querySelector('.najd-announce__track');
    if (!track) return;
    // CSS animation handles the infinite scroll
    track.style.animation = 'ticker 30s linear infinite';
  }
  return { init };
})();

// ═══════════════════════════════════════════
// Module: Countdown Timer
// ═══════════════════════════════════════════
const CountdownModule = (() => {
  let endDate, els;

  function init() {
    const section = document.querySelector('.najd-countdown');
    if (!section) return;

    const raw = section.dataset.end;
    endDate = raw ? new Date(raw) : new Date(Date.now() + 3 * 86400000); // fallback 3 days

    els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-mins'),
      s: document.getElementById('cd-secs'),
    };

    tick();
    setInterval(tick, 1000);
  }

  function tick() {
    const diff = Math.max(0, endDate - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (els.d) els.d.textContent = String(d).padStart(2, '0');
    if (els.h) els.h.textContent = String(h).padStart(2, '0');
    if (els.m) els.m.textContent = String(m).padStart(2, '0');
    if (els.s) els.s.textContent = String(s).padStart(2, '0');
  }

  return { init };
})();

// ═══════════════════════════════════════════
// Module: Social Proof Notifications
// ═══════════════════════════════════════════
const SocialProofModule = (() => {
  const CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'أبها', 'تبوك', 'الخبر'];
  const NAMES = ['أحمد', 'سارة', 'محمد', 'نورة', 'خالد', 'ريم', 'عبدالله', 'فاطمة'];
  const TIMES = ['منذ دقيقتين', 'منذ ٥ دقائق', 'منذ ١٠ دقائق', 'منذ ربع ساعة'];
  let el, nameEl, productEl, timeEl, closeBtn, timer;

  function init() {
    el = document.getElementById('social-proof');
    if (!el) return;

    nameEl = document.getElementById('sp-name');
    productEl = document.getElementById('sp-product');
    timeEl = document.getElementById('sp-time');
    closeBtn = document.getElementById('sp-close');

    closeBtn?.addEventListener('click', hide);
    scheduleNext(3000);
  }

  function show() {
    const name = pick(NAMES);
    const city = pick(CITIES);
    nameEl.textContent = `${name} من ${city} اشترى`;
    productEl.textContent = ''; // Will be populated from recent orders API if available
    timeEl.textContent = pick(TIMES);
    el.classList.add('is-visible');
    timer = setTimeout(hide, 5000);
  }

  function hide() {
    el.classList.remove('is-visible');
    clearTimeout(timer);
    scheduleNext(15000 + Math.random() * 10000);
  }

  function scheduleNext(delay) {
    setTimeout(show, delay);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  return { init };
})();

// ═══════════════════════════════════════════
// Module: Smart Popup (delay + exit intent)
// ═══════════════════════════════════════════
const PopupModule = (() => {
  const STORAGE_KEY = 'najd_popup_closed';
  let overlay, popup, closeBtn, copyBtn;

  function init() {
    overlay = document.getElementById('popup-overlay');
    if (!overlay || sessionStorage.getItem(STORAGE_KEY)) return;

    closeBtn = document.getElementById('popup-close');
    copyBtn = overlay.querySelector('.najd-popup__copy');

    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    copyBtn?.addEventListener('click', handleCopy);

    // Delay trigger
    const delay = (overlay.dataset.delay || 5) * 1000;
    setTimeout(open, delay);

    // Exit intent trigger
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 10 && !overlay.classList.contains('is-open')) open();
    }, { once: true });
  }

  function open() {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    overlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  function handleCopy() {
    const code = copyBtn.dataset.copy;
    navigator.clipboard.writeText(code).then(() => {
      copyBtn.textContent = 'تم النسخ ✓';
      setTimeout(() => { copyBtn.textContent = 'نسخ'; }, 2000);
    });
  }

  return { init };
})();

// ═══════════════════════════════════════════
// Module: Shipping Progress Bar
// ═══════════════════════════════════════════
const ShippingModule = (() => {
  function init() {
    const bar = document.getElementById('shipping-bar');
    if (!bar) return;

    const threshold = parseFloat(bar.dataset.threshold) || 200;

    // Listen to Salla cart events
    salla.event.on('cart::updated', (data) => update(data, threshold));
    salla.event.on('cart::item.added', (data) => update(data, threshold));
  }

  function update(data, threshold) {
    const total = data?.cart?.total || 0;
    const remaining = Math.max(0, threshold - total);
    const pct = Math.min((total / threshold) * 100, 100);

    const fill = document.getElementById('shipping-fill');
    const text = document.getElementById('shipping-remaining');

    if (fill) fill.style.width = `${pct}%`;
    if (text) {
      text.textContent = remaining > 0
        ? `${remaining.toFixed(0)} ر.س`
        : 'مبروك! شحن مجاني 🎉';
    }
  }

  return { init };
})();

// ═══════════════════════════════════════════
// Module: FAQ Accordion
// ═══════════════════════════════════════════
const FAQModule = (() => {
  function init() {
    const list = document.getElementById('faq-list');
    if (!list) return;

    list.querySelectorAll('.najd-faq__q').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('is-open');

        // Close all
        list.querySelectorAll('.najd-faq__item').forEach(i => i.classList.remove('is-open'));
        btn.setAttribute('aria-expanded', 'false');

        // Toggle current
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  return { init };
})();

// ═══════════════════════════════════════════
// Module: Product Tabs
// ═══════════════════════════════════════════
const TabsModule = (() => {
  function init() {
    const tabsNav = document.querySelector('.najd-product-tabs__nav');
    if (!tabsNav) return;

    tabsNav.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabsNav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.najd-product-tabs__content > div').forEach(d => d.classList.remove('active'));
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      });
    });
  }
  return { init };
})();

// ═══════════════════════════════════════════
// Module: UTM Tracker
// ═══════════════════════════════════════════
const UTMModule = (() => {
  function init() {
    const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const qs = new URLSearchParams(window.location.search);
    const data = {};

    params.forEach((p) => {
      const v = qs.get(p) || sessionStorage.getItem(p);
      if (v) { data[p] = v; sessionStorage.setItem(p, v); }
    });

    // Append UTM to all outbound/CTA links
    if (Object.keys(data).length) {
      document.querySelectorAll('a[href*="/cart"], a[href*="/checkout"]').forEach((a) => {
        const url = new URL(a.href, window.location.origin);
        Object.entries(data).forEach(([k, v]) => url.searchParams.set(k, v));
        a.href = url.toString();
      });
    }
  }
  return { init };
})();

// ═══════════════════════════════════════════
// Module: Quick View Modal
// ═══════════════════════════════════════════
const QuickViewModule = (() => {
  function init() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.najd-quick-view-btn');
      if (!btn) return;
      e.preventDefault();
      const productId = btn.dataset.id;
      if (productId) {
        salla.product.quickView(productId);
      }
    });
  }
  return { init };
})();

// ═══════════════════════════════════════════
// App Init
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  HeaderModule.init();
  AnnounceModule.init();
  CountdownModule.init();
  SocialProofModule.init();
  PopupModule.init();
  ShippingModule.init();
  FAQModule.init();
  TabsModule.init();
  UTMModule.init();
  QuickViewModule.init();
});
