export default class Cart {
    constructor() {
        this.state = {
            items: new Map(),
        };
    }
    addToCart(item) {
        const existingItem = this.state.items.get(item.id);
        if (existingItem) {
            existingItem.quantity++;
        }
        else {
            this.state.items.set(item.id, { item, quantity: 1 });
        }
        this.updateCartElement();
    }
    removeFromCart(itemId) {
        const existingItem = this.state.items.get(itemId);
        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity--;
        }
        else {
            this.state.items.delete(itemId);
        }
        this.updateCartElement();
    }
    updateCartElement() {
        const cartItemsList = document.querySelector('.items-list');
        const totalQuantityElement = document.querySelector('.total-quantity');
        const totalPriceElement = document.querySelector('.total-price');
        if (!cartItemsList || !totalQuantityElement || !totalPriceElement)
            return;
        cartItemsList.innerHTML = '';
        let totalQuantity = 0;
        let totalPrice = 0;
        this.state.items.forEach(({ item, quantity }) => {
            totalQuantity += quantity;
            totalPrice += item.price * quantity;
            const listItem = document.createElement('li');
            listItem.innerHTML = `
        <span>${item.title} - $${item.price.toFixed(2)} x ${quantity}</span>
        <button class="remove-item" data-id="${item.id}">Remove</button>
      `;
            cartItemsList.appendChild(listItem);
        });
        totalQuantityElement.innerText = totalQuantity.toString();
        totalPriceElement.innerText = totalPrice.toFixed(2);
        this.addRemoveEventListeners();
    }
    addRemoveEventListeners() {
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                if (itemId) {
                    this.removeFromCart(parseInt(itemId));
                }
            });
        });
    }
}
