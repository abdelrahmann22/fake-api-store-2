import { Item } from './item.interface';
import Cart from './cart.js';

interface ProductsState {
  allItems: Item[];
  filteredItems: Item[];
  currentPage: number;
  itemsPerPage: number;
}

export default class Products {
  private productsMap: Map<number, Item> = new Map();
  private state: ProductsState = {
    allItems: [],
    filteredItems: [],
    currentPage: 1,
    itemsPerPage: 5,
  };
  private cart: Cart;

  constructor() {
    this.cart = new Cart();
  }

  async getItems(): Promise<Item[]> {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const items: Item[] = await response.json();
      this.state.allItems = items;
      this.state.filteredItems = items;
      this.productsMap = new Map(items.map((item) => [item.id, item]));
      this.createItemsElement();
      this.categories();
      return items;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      const errorMessage = document.createElement('div');
      errorMessage.innerText = 'Failed to fetch items. Please try again later.';
      document.body.appendChild(errorMessage);
      throw error;
    }
  }

  createItemsElement() {
    const showItems = document.querySelector(".show-items") as HTMLElement;
    if (!showItems) return;

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

  categories(): void {
    const categories = [...new Set(this.state.allItems.map((item) => item.category))];
    const categorySelect = document.getElementById('categ-list') as HTMLSelectElement;
    if (!categorySelect) return;

    categorySelect.innerHTML = '<option value="All Categories">All Categories</option>';
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.innerText = category;
      categorySelect.appendChild(option);
    });
  }

  applyFilters(): Item[] {
    const search = document.getElementById('search-box') as HTMLInputElement;
    const categorySelect = document.getElementById('categ-list') as HTMLSelectElement;
    const minPrice = document.getElementById('min-price') as HTMLInputElement;
    const maxPrice = document.getElementById('max-price') as HTMLInputElement;

    const filteredItems = this.state.allItems.filter((item) => {
      return (
        (!search.value || item.title.toLowerCase().includes(search.value.toLowerCase())) &&
        (categorySelect.value === 'All Categories' || item.category === categorySelect.value) &&
        (!minPrice.value || item.price >= parseFloat(minPrice.value)) &&
        (!maxPrice.value || item.price <= parseFloat(maxPrice.value))
      );
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
        const itemElement = (e.target as HTMLElement).closest('.item');
        const itemId = itemElement?.getAttribute('data-id');
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
    const pagination = document.querySelector(".pagination") as HTMLElement;
    if (!pagination) return;

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

  navigateTo(page: number) {
    this.state.currentPage = page;
    this.createItemsElement();
  }
}
