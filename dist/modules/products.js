var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Products {
    constructor() {
        this.allItems = [];
        this.filteredItems = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }
    getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://fakestoreapi.com/products";
            try {
                const response = yield fetch(url, { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const items = yield response.json();
                this.allItems = items;
            }
            catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                throw error;
            }
        });
    }
    createItemsElement() {
        const showItems = document.querySelector(".show-items");
        if (!showItems)
            return;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToDisplay = this.filteredItems.slice(startIndex, endIndex);
        showItems.innerHTML = '';
        itemsToDisplay.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `
		  <img src="${item.image}" alt="${item.title}">
		  <h2>${item.title}</h2>
		  <h4>$${item.price}</h4>
		  <div class="buttons-container">
			<button class="view-details">View Details</button>
			<button class="add-cart">Add to Cart</button>
		  </div>
		`;
            showItems.appendChild(itemDiv);
        });
    }
    Categories() {
        const categories = [...new Set(this.allItems.map(item => item.category))];
        const categorySelect = document.getElementById("categ-list");
        if (!categorySelect)
            return;
        categorySelect.innerHTML = '<option value="All Categories">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            categorySelect.appendChild(option);
        });
    }
    applyFilters() {
        const search = document.getElementById("search-box");
        const categorySelect = document.getElementById("categ-list");
        const minPrice = document.getElementById("min-price");
        const maxPrice = document.getElementById("max-price");
        this.filteredItems = this.allItems.filter(item => {
            return ((!search.value.toLowerCase() || item.title.toLowerCase().includes(search.value.toLowerCase())) &&
                (categorySelect.value === "All Categories" || item.category === categorySelect.value) &&
                (!minPrice.value || item.price >= parseFloat(minPrice.value)) &&
                (!maxPrice.value || item.price <= parseFloat(maxPrice.value)));
        });
        this.createItemsElement(); // Update displayed items after filtering
    }
}
