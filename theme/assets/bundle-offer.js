if (!customElements.get('bundle-offer')) {
  customElements.define(
    'bundle-offer',
    class BundleOffer extends HTMLElement {
      connectedCallback() {
        // product-form.js may run after this script, so wait for its methods to exist.
        customElements.whenDefined('product-form').then(() => this.init());
      }

      init() {
        this.productForm = document.getElementById(this.dataset.formId)?.closest('product-form');
        if (!this.productForm || !this.isConnected) return;

        this.form = this.productForm.querySelector('form');
        this.submitButton = this.productForm.querySelector('[type="submit"]');
        this.quantityForm = document.getElementById(`Quantity-Form-${this.dataset.sectionId}`);
        this.products = JSON.parse(this.querySelector('[data-bundle-products]').textContent);
        this.radios = Array.from(this.querySelectorAll('.bundle-offer__input'));
        this.selections = [];
        this.mainDisabled = this.submitButton.hasAttribute('disabled');

        this.radios.forEach((radio) => radio.addEventListener('change', this.onTierChange.bind(this)));
        this.addEventListener('change', this.onPickChange.bind(this));

        // Capture phase so a bundle submit is handled here instead of the theme's single-item add.
        this.onSubmit = this.onSubmit.bind(this);
        this.productForm.addEventListener('submit', this.onSubmit, true);

        if (typeof subscribe === 'function') {
          this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, this.onMainVariantChange.bind(this));
        }

        this.onTierChange();
      }

      disconnectedCallback() {
        this.productForm?.removeEventListener('submit', this.onSubmit, true);
        this.variantChangeUnsubscriber?.();
      }

      get quantity() {
        return parseInt(this.radios.find((radio) => radio.checked)?.value || '1', 10);
      }

      get currentProductId() {
        return Number(this.dataset.productId);
      }

      get currentVariantId() {
        return Number(this.form.querySelector('input[name="id"]').value);
      }

      onTierChange() {
        const quantity = this.quantity;

        this.querySelectorAll('.bundle-offer__tier').forEach((tier) => {
          const selected = tier.querySelector('.bundle-offer__input').checked;
          const picks = tier.querySelector('[data-picks]');
          tier.classList.toggle('is-selected', selected);
          if (!picks) return;
          picks.hidden = !selected;
          if (selected) this.renderPicks(picks, quantity);
        });

        this.quantityForm?.classList.toggle('hidden', quantity > 1);
        this.updateSubmitState();
      }

      onPickChange(event) {
        const row = event.target.closest('[data-pick-index]');
        if (!row) return;
        const index = Number(row.dataset.pickIndex);

        if (event.target.matches('[data-pick-product]')) {
          const product = this.findProduct(Number(event.target.value));
          const previousTitle = this.findVariant(this.selections[index].variantId)?.title;
          const sameSize = product.variants.find((variant) => variant.title === previousTitle && variant.available);
          this.selections[index] = { productId: product.id, variantId: (sameSize || this.firstAvailable(product))?.id };
          this.renderVariantOptions(row.querySelector('[data-pick-variant]'), product, this.selections[index].variantId);
        } else if (event.target.matches('[data-pick-variant]')) {
          this.selections[index].variantId = Number(event.target.value);
        }

        this.updateSubmitState();
      }

      onMainVariantChange({ data: { variant } }) {
        if (!this.isConnected) return;
        this.mainDisabled = !variant?.available;

        // Keep the first bundle item in step with the size picked on the page.
        if (variant?.available && this.selections[0]?.productId === this.currentProductId) {
          this.selections[0].variantId = variant.id;
          const picks = this.querySelector('.is-selected [data-picks]');
          if (picks) this.renderPicks(picks, this.quantity);
        }

        // The theme resets the button after its own update; re-apply ours afterwards.
        setTimeout(() => this.updateSubmitState());
      }

      findProduct(productId) {
        return this.products.find((product) => product.id === productId);
      }

      findVariant(variantId) {
        for (const product of this.products) {
          const variant = product.variants.find((item) => item.id === variantId);
          if (variant) return variant;
        }
      }

      firstAvailable(product) {
        return product.variants.find((variant) => variant.available) || product.variants[0];
      }

      defaultSelection() {
        const product = this.findProduct(this.currentProductId);
        const variant = this.findVariant(this.currentVariantId);
        return {
          productId: product.id,
          variantId: variant?.available ? variant.id : this.firstAvailable(product).id,
        };
      }

      renderPicks(container, quantity) {
        while (this.selections.length < quantity) this.selections.push(this.defaultSelection());

        container.replaceChildren(
          ...Array.from({ length: quantity }, (_, index) => this.buildPickRow(index, this.selections[index]))
        );
      }

      buildPickRow(index, selection) {
        const row = document.createElement('div');
        row.className = 'bundle-offer__pick';
        row.dataset.pickIndex = index;

        const label = document.createElement('span');
        label.className = 'bundle-offer__pick-label';
        label.textContent = `#${index + 1}`;

        const productSelect = document.createElement('select');
        productSelect.className = 'bundle-offer__select';
        productSelect.dataset.pickProduct = '';
        productSelect.setAttribute('aria-label', `Item ${index + 1} style`);
        this.products
          .filter((product) => product.available || product.id === selection.productId)
          .forEach((product) => {
            const option = new Option(product.title, product.id, false, product.id === selection.productId);
            productSelect.add(option);
          });

        const variantSelect = document.createElement('select');
        variantSelect.className = 'bundle-offer__select bundle-offer__select--size';
        variantSelect.dataset.pickVariant = '';
        variantSelect.setAttribute('aria-label', `Item ${index + 1} size`);
        this.renderVariantOptions(variantSelect, this.findProduct(selection.productId), selection.variantId);

        row.append(label, productSelect, variantSelect);
        return row;
      }

      renderVariantOptions(select, product, selectedVariantId) {
        select.replaceChildren(
          ...product.variants.map((variant) => {
            const text = variant.available ? variant.title : `${variant.title} - Sold out`;
            const option = new Option(text, variant.id, false, variant.id === selectedVariantId);
            option.disabled = !variant.available;
            return option;
          })
        );
      }

      bundleItems() {
        const quantities = new Map();
        this.selections.slice(0, this.quantity).forEach(({ variantId }) => {
          quantities.set(variantId, (quantities.get(variantId) || 0) + 1);
        });
        return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
      }

      updateSubmitState() {
        if (this.quantity === 1) {
          this.productForm.toggleSubmitButton(this.mainDisabled, window.variantStrings.soldOut);
          return;
        }

        const valid = this.selections
          .slice(0, this.quantity)
          .every(({ variantId }) => this.findVariant(variantId)?.available);
        this.productForm.toggleSubmitButton(!valid, window.variantStrings.soldOut);
      }

      onSubmit(event) {
        if (this.quantity === 1) return;

        event.preventDefault();
        event.stopPropagation();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        const cart = document.querySelector('cart-drawer');
        const spinner = this.productForm.querySelector('.loading__spinner');

        this.productForm.handleErrorMessage();
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        spinner?.classList.remove('hidden');

        const body = { items: this.bundleItems() };
        if (cart) {
          body.sections = cart.getSectionsToRender().map((section) => section.id);
          body.sections_url = window.location.pathname;
          cart.setActiveElement(document.activeElement);
        }

        fetch(`${routes.cart_add_url}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              this.productForm.handleErrorMessage(response.description || response.message);
              return;
            }
            if (!cart) {
              window.location = window.routes.cart_url;
              return;
            }

            publish(PUB_SUB_EVENTS.cartUpdate, { source: 'bundle-offer', cartData: response });
            cart.classList.remove('is-empty');
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener('modalClosed', () => setTimeout(() => cart.renderContents(response)), {
                once: true,
              });
              quickAddModal.hide(true);
            } else {
              cart.renderContents(response);
            }
          })
          .catch((error) => console.error(error))
          .finally(() => {
            this.submitButton.classList.remove('loading');
            this.submitButton.removeAttribute('aria-disabled');
            spinner?.classList.add('hidden');
          });
      }
    }
  );
}
