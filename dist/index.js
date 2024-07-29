var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Products from './modules/products.js';
import Cart from './modules/cart.js';
const products = new Products();
const cart = new Cart();
function initializeApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield products.getItems();
            setupEventListeners();
        }
        catch (error) {
            console.error('Error fetching products:', error);
            const errorMessage = document.createElement('div');
            errorMessage.innerText = 'There was an error loading products. Please try again later.';
            document.body.appendChild(errorMessage);
        }
    });
}
function setupEventListeners() {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            products.applyFilters();
        });
    }
    const categorySelect = document.getElementById('categ-list');
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            products.applyFilters();
        });
    }
    const minPrice = document.getElementById('min-price');
    if (minPrice) {
        minPrice.addEventListener('input', () => {
            products.applyFilters();
        });
    }
    const maxPrice = document.getElementById('max-price');
    if (maxPrice) {
        maxPrice.addEventListener('input', () => {
            products.applyFilters();
        });
    }
}
initializeApp();
