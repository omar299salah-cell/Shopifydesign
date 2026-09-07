document.documentElement.classList.remove('no-js');

/* ---------- helpers ---------- */
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function trapFocus(container) {
  var focusable = qsa('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])', container);
  if (!focusable.length) return;
  focusable[0].focus();
}

/* ---------- mobile menu drawer ---------- */
(function () {
  var toggle = qs('[data-mobile-menu-toggle]');
  var drawer = qs('[data-mobile-menu]');
  if (!toggle || !drawer) return;

  function open() {
    drawer.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    trapFocus(drawer);
  }
  function close() {
    drawer.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', open);
  qsa('[data-mobile-menu-close]', drawer).forEach(function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) close();
  });
})();

/* ---------- header search toggle ---------- */
(function () {
  var toggles = qsa('[data-search-toggle]');
  var panel = qs('[data-search-panel]');
  if (!panel || !toggles.length) return;

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isHidden = panel.hidden;
      panel.hidden = !isHidden;
      toggles.forEach(function (b) { b.setAttribute('aria-expanded', String(isHidden)); });
      if (isHidden) {
        var input = qs('input[type="search"]', panel);
        if (input) input.focus();
      }
    });
  });
})();

/* ---------- header dropdown: close others + escape ---------- */
(function () {
  var dropdowns = qsa('[data-header-dropdown]');
  if (!dropdowns.length) return;

  dropdowns.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        dropdowns.forEach(function (other) {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (d) {
      if (d.open && !d.contains(e.target)) d.open = false;
    });
  });
})();

/* ---------- cart drawer (Section Rendering API, no full reloads) ---------- */
var CartDrawer = (function () {
  var routes = window.themeRoutes || { cartUrl: '/cart', cartAddUrl: '/cart/add', cartChangeUrl: '/cart/change' };
  var sectionWrapperId = 'shopify-section-cart-drawer';

  function getDrawer() { return qs('[data-cart-drawer]'); }

  function open() {
    var drawer = getDrawer();
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    var drawer = getDrawer();
    if (!drawer) return;
    drawer.hidden = true;
    document.body.style.overflow = '';
  }

  function updateCountBadges(count) {
    qsa('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      el.setAttribute('data-empty', count == 0 ? 'true' : 'false');
    });
  }

  function refreshMarkup() {
    return fetch(routes.cartUrl + '?sections=cart-drawer')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var wrapper = document.getElementById(sectionWrapperId);
        if (wrapper && data['cart-drawer']) {
          wrapper.innerHTML = data['cart-drawer'];
        }
      });
  }

  function refreshAndOpen() {
    return refreshMarkup().then(open);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-drawer-toggle]')) {
      e.preventDefault();
      refreshAndOpen();
    }
    if (e.target.closest('[data-cart-drawer-close]')) {
      close();
    }
  });

  document.addEventListener('keydown', function (e) {
    var drawer = getDrawer();
    if (e.key === 'Escape' && drawer && !drawer.hidden) close();
  });

  return { open: open, close: close, updateCountBadges: updateCountBadges, refreshMarkup: refreshMarkup };
})();

/* ---------- add to cart (product forms + quick add) ---------- */
(function () {
  var routes = window.themeRoutes || { cartAddUrl: '/cart/add' };

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.matches('[data-product-form]')) return;
    e.preventDefault();

    var submitBtn = qs('[type="submit"]', form);
    var errorEl = qs('[data-form-error]', form);
    if (errorEl) errorEl.textContent = '';
    if (submitBtn) submitBtn.classList.add('btn--loading');

    fetch(routes.cartAddUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: form.querySelector('[name="id"]').value,
            quantity: parseInt((form.querySelector('[name="quantity"]') || {}).value || '1', 10)
          }
        ]
      })
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.description || 'Unable to add to cart');
        }
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        CartDrawer.updateCountBadges(cart.item_count);
        if (document.body.dataset.template === 'cart') {
          window.location.reload();
        } else {
          CartDrawer.refreshMarkup().then(CartDrawer.open);
        }
      })
      .catch(function (err) {
        if (errorEl) errorEl.textContent = err.message;
      })
      .finally(function () {
        if (submitBtn) submitBtn.classList.remove('btn--loading');
      });
  });
})();

/* ---------- cart drawer / cart page quantity + remove ---------- */
(function () {
  var routes = window.themeRoutes || { cartChangeUrl: '/cart/change' };

  document.addEventListener('click', function (e) {
    var incBtn = e.target.closest('[data-qty-increase]');
    var decBtn = e.target.closest('[data-qty-decrease]');
    var removeBtn = e.target.closest('[data-cart-remove]');
    if (!incBtn && !decBtn && !removeBtn) return;

    if (incBtn || decBtn) {
      var stepper = (incBtn || decBtn).closest('[data-qty-stepper]');
      var input = qs('[data-qty-input]', stepper);
      var value = parseInt(input.value || '0', 10);
      value = incBtn ? value + 1 : Math.max(0, value - 1);
      input.value = value;
      updateLine(input.getAttribute('data-line'), value, e.target.closest('[data-cart-page]'));
    }

    if (removeBtn) {
      updateLine(removeBtn.getAttribute('data-line'), 0, removeBtn.closest('[data-cart-page]'));
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-qty-input]')) {
      updateLine(e.target.getAttribute('data-line'), parseInt(e.target.value || '0', 10), e.target.closest('[data-cart-page]'));
    }
  });

  function updateLine(line, quantity, isCartPage) {
    fetch(routes.cartChangeUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: parseInt(line, 10), quantity: quantity })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        CartDrawer.updateCountBadges(cart.item_count);
        if (isCartPage) {
          window.location.reload();
        } else {
          CartDrawer.refreshMarkup();
        }
      })
      .catch(function () {});
  }
})();

/* ---------- quick add (product cards) ---------- */
(function () {
  var routes = window.themeRoutes || { cartAddUrl: '/cart/add' };

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-quick-add-toggle]');
    var variantBtn = e.target.closest('[data-quick-add-variant]');

    if (toggle) {
      var wrap = toggle.closest('[data-quick-add]');
      var sizes = qs('[data-quick-add-sizes]', wrap);
      var isHidden = sizes.hidden;
      sizes.hidden = !isHidden;
      toggle.setAttribute('aria-expanded', String(isHidden));
      return;
    }

    if (variantBtn && !variantBtn.disabled) {
      var variantId = variantBtn.getAttribute('data-quick-add-variant');
      variantBtn.classList.add('btn--loading');

      fetch(routes.cartAddUrl + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      })
        .then(function (res) { return res.json(); })
        .then(function () { return fetch('/cart.js'); })
        .then(function (res) { return res.json(); })
        .then(function (cart) {
          CartDrawer.updateCountBadges(cart.item_count);
          return CartDrawer.refreshMarkup();
        })
        .then(function () { CartDrawer.open(); })
        .catch(function () {})
        .finally(function () { variantBtn.classList.remove('btn--loading'); });
    }
  });
})();

/* ---------- size guide modal ---------- */
(function () {
  var modal = qs('[data-size-guide-modal]');
  if (!modal) return;

  function open() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  qsa('[data-size-guide-open]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });
  });
  qsa('[data-size-guide-close]', modal).forEach(function (el) {
    el.addEventListener('click', close);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

/* ---------- collection filter drawer (mobile) ---------- */
(function () {
  var panel = qs('[data-filter-panel]');
  if (!panel) return;

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-filter-toggle]')) return;
    var isOpen = panel.classList.contains('is-open');
    panel.classList.toggle('is-open', !isOpen);
    qsa('[data-filter-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });
})();

/* ---------- collection sort auto-submit ---------- */
(function () {
  var select = qs('[data-sort-select]');
  if (!select) return;
  select.addEventListener('change', function () {
    select.form.submit();
  });
})();

/* ---------- product page standalone quantity stepper ---------- */
(function () {
  document.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-qty-standalone-increase]');
    var dec = e.target.closest('[data-qty-standalone-decrease]');
    if (!inc && !dec) return;
    var stepper = (inc || dec).closest('[data-qty-stepper-standalone]');
    var input = qs('[data-qty-standalone-input]', stepper);
    var value = parseInt(input.value || '1', 10);
    input.value = inc ? value + 1 : Math.max(1, value - 1);
  });
})();

/* ---------- product variant picker ---------- */
(function () {
  qsa('[data-product-form]').forEach(function (form) {
    var script = qs('[data-product-variants]', form);
    if (!script) return;
    var variants = JSON.parse(script.textContent);
    var idInput = qs('[data-selected-variant-id]', form);
    var priceEl = qs('[data-price]', form.closest('.product-info') || form);
    var comparePriceEl = qs('[data-compare-price]', form.closest('.product-info') || form);
    var submitBtn = qs('[data-add-to-cart-btn]', form);
    var submitText = qs('[data-add-to-cart-text]', form);
    var gallery = qs('[data-product-gallery]');
    var mainImage = gallery ? qs('[data-gallery-main]', gallery) : null;

    function formatMoney(cents) {
      return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: (window.Shopify && Shopify.currency && Shopify.currency.active) || 'USD' });
    }

    function currentSelections() {
      var groups = {};
      qsa('[data-option-value].is-selected', form).forEach(function (btn) {
        groups[btn.getAttribute('data-option-index')] = btn.getAttribute('data-value');
      });
      var indexes = Object.keys(groups).sort(function (a, b) { return a - b; });
      return indexes.map(function (i) { return groups[i]; });
    }

    function findMatchingVariant() {
      var selections = currentSelections();
      return variants.find(function (v) {
        return v.options.length === selections.length && v.options.every(function (opt, i) { return opt === selections[i]; });
      });
    }

    function updateUI() {
      var variant = findMatchingVariant();
      if (!variant) return;

      idInput.value = variant.id;

      if (priceEl) {
        try { priceEl.textContent = formatMoney(variant.price); } catch (e) {}
      }
      if (comparePriceEl) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          try { comparePriceEl.textContent = formatMoney(variant.compare_at_price); } catch (e) {}
          comparePriceEl.hidden = false;
          if (priceEl) priceEl.classList.add('product-info__price-sale');
        } else {
          comparePriceEl.hidden = true;
          if (priceEl) priceEl.classList.remove('product-info__price-sale');
        }
      }

      if (submitBtn) {
        submitBtn.disabled = !variant.available;
        submitBtn.setAttribute('aria-disabled', String(!variant.available));
      }
      if (submitText) {
        submitText.textContent = variant.available
          ? (window.themeStrings && window.themeStrings.addToCart) || 'Add to cart'
          : (window.themeStrings && window.themeStrings.soldOut) || 'Sold out';
      }

      if (mainImage && variant.featured_image) {
        mainImage.src = variant.featured_image;
      }
    }

    form.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-option-value]');
      if (!btn) return;
      var index = btn.getAttribute('data-option-index');
      qsa('[data-option-value][data-option-index="' + index + '"]', form).forEach(function (b) {
        b.classList.remove('is-selected');
      });
      btn.classList.add('is-selected');
      var headerValueEl = btn.closest('[data-option-index]').querySelector('[data-option-selected-value]');
      if (headerValueEl) headerValueEl.textContent = btn.getAttribute('data-value');
      updateUI();
    });
  });
})();

/* ---------- sticky add-to-cart bar (mobile) ---------- */
(function () {
  var bar = qs('[data-sticky-atc]');
  var trigger = qs('[data-add-to-cart-btn]');
  if (!bar || !trigger || !window.IntersectionObserver) return;

  var stickyBtn = qs('[data-sticky-atc-btn]', bar);
  var stickyPrice = qs('[data-sticky-atc-price]', bar);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      bar.hidden = entry.isIntersecting;
    });
  }, { threshold: 0 });
  observer.observe(trigger);

  if (stickyBtn) {
    stickyBtn.addEventListener('click', function () {
      trigger.click();
    });
  }

  var priceEl = qs('[data-price]');
  if (priceEl && stickyPrice && window.MutationObserver) {
    new MutationObserver(function () {
      stickyPrice.textContent = priceEl.textContent;
    }).observe(priceEl, { childList: true, characterData: true, subtree: true });
  }
})();

/* ---------- product recommendations (native Shopify API) ---------- */
(function () {
  qsa('[data-product-recommendations]').forEach(function (el) {
    var url = el.getAttribute('data-url');
    if (!url) return;
    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var newEl = tmp.querySelector('[data-product-recommendations]');
        if (newEl && newEl.innerHTML.trim() !== '') {
          el.innerHTML = newEl.innerHTML;
        }
      })
      .catch(function () {});
  });
})();

/* ---------- product media gallery (simple thumbnail switch) ---------- */
(function () {
  qsa('[data-product-gallery]').forEach(function (gallery) {
    var main = qs('[data-gallery-main]', gallery);
    qsa('[data-gallery-thumb]', gallery).forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var full = thumb.getAttribute('data-full');
        if (main && full) main.src = full;
        qsa('[data-gallery-thumb]', gallery).forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  });
})();
