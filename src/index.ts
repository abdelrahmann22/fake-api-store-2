import Products from './modules/products.js';
import Cart from './modules/cart.js';

const products = new Products();
const cart = new Cart();

async function initializeApp(): Promise<void> {
  try {
    await products.getItems();
    setupEventListeners();
  } catch (error) {
    console.error('Error fetching products:', error);
    const errorMessage = document.createElement('div');
    errorMessage.innerText = 'There was an error loading products. Please try again later.';
    document.body.appendChild(errorMessage);
  }
}

function setupEventListeners(): void {
  const searchBox = document.getElementById('search-box') as HTMLInputElement;
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      products.applyFilters();
    });
  }

  const categorySelect = document.getElementById('categ-list') as HTMLSelectElement;
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      products.applyFilters();
    });
  }

  const minPrice = document.getElementById('min-price') as HTMLInputElement;
  if (minPrice) {
    minPrice.addEventListener('input', () => {
      products.applyFilters();
    });
  }

  const maxPrice = document.getElementById('max-price') as HTMLInputElement;
  if (maxPrice) {
    maxPrice.addEventListener('input', () => {
      products.applyFilters();
    });
  }
}

initializeApp();
