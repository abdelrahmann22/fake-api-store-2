var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cart from './cart.js';
export default class Products {
    constructor() {
        this.productsMap = new Map();
        this.state = {
            allItems: [],
            filteredItems: [],
            currentPage: 1,
            itemsPerPage: 5,
        };
        this.cart = new Cart();
    }
    getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://fakestoreapi.com/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const items = yield response.json();
                this.state.allItems = items;
                this.state.filteredItems = items;
                this.productsMap = new Map(items.map((item) => [item.id, item]));
                this.createItemsElement();
                this.categories();
                return items;
            }
            catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                const errorMessage = document.createElement('div');
                errorMessage.innerText = 'Failed to fetch items. Please try again later.';
                document.body.appendChild(errorMessage);
                throw error;
            }
        });
    }
    createItemsElement() {
        const showItems = document.querySelector(".show-items");
        if (!showItems)
            return;
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const itemsToDisplay = this.state.filteredItems.slice(startIndex, endIndex);
        showItems.innerHTML = '';
        itemsToDisplay.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.setAttribute('data-id', item.id.toString());
            itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h2>${item.title}</h2>
        <h4>$${item.price.toFixed(2)}</h4>
        <div class="buttons-container">
          <button class="view-details">View Details</button>
          <button class="add-cart">Add to Cart</button>
        </div>
      `;
            showItems.appendChild(itemDiv);
        });
        this.addCartEventListeners();
        this.renderPagination();
    }
    categories() {
        const categories = [...new Set(this.state.allItems.map((item) => item.category))];
        const categorySelect = document.getElementById('categ-list');
        if (!categorySelect)
            return;
        categorySelect.innerHTML = '<option value="All Categories">All Categories</option>';
        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.innerText = category;
            categorySelect.appendChild(option);
        });
    }
    applyFilters() {
        const search = document.getElementById('search-box');
        const categorySelect = document.getElementById('categ-list');
        const minPrice = document.getElementById('min-price');
        const maxPrice = document.getElementById('max-price');
        const filteredItems = this.state.allItems.filter((item) => {
            return ((!search.value || item.title.toLowerCase().includes(search.value.toLowerCase())) &&
                (categorySelect.value === 'All Categories' || item.category === categorySelect.value) &&
                (!minPrice.value || item.price >= parseFloat(minPrice.value)) &&
                (!maxPrice.value || item.price <= parseFloat(maxPrice.value)));
        });
        this.state.filteredItems = filteredItems;
        this.state.currentPage = 1;
        this.createItemsElement();
        return filteredItems;
    }
    addCartEventListeners() {
        const addToCartButtons = document.querySelectorAll('.add-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemElement = e.target.closest('.item');
                const itemId = itemElement === null || itemElement === void 0 ? void 0 : itemElement.getAttribute('data-id');
                if (itemId) {
                    const item = this.productsMap.get(parseInt(itemId));
                    if (item) {
                        this.cart.addToCart(item);
                    }
                }
            });
        });
    }
    renderPagination() {
        const pagination = document.querySelector(".pagination");
        if (!pagination)
            return;
        const totalPages = Math.ceil(this.state.filteredItems.length / this.state.itemsPerPage);
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i.toString();
            button.addEventListener('click', () => {
                this.navigateTo(i);
            });
            pagination.appendChild(button);
        }
    }
    navigateTo(page) {
        this.state.currentPage = page;
        this.createItemsElement();
    }
}
