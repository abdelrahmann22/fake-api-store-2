type Item = {
	id: number,
	title: string,
	price: number,
	category: string,
	description: string,
	image: string,
  }
  
  export class Products {
	public allItems: Item[] = [];
	public filteredItems: Item[] = [];
	public currentPage: number = 1;
	public itemsPerPage: number = 5;
  
	async getItems() {
	  const url: string = "https://fakestoreapi.com/products";
	  try {
		const response = await fetch(url, { method: 'GET' });
		if (!response.ok) {
		  throw new Error('Network response was not ok');
		}
		const items: Item[] = await response.json();
		this.allItems = items;
	  } catch (error) {
		console.error('There was a problem with the fetch operation:', error);
		throw error;
	  }
	}
  
	createItemsElement() {
	  const showItems = document.querySelector(".show-items") as HTMLElement;
	  if (!showItems) return;
	  
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
	  const categorySelect = document.getElementById("categ-list") as HTMLSelectElement;
	  if (!categorySelect) return;
	  
	  categorySelect.innerHTML = '<option value="All Categories">All Categories</option>';
	  categories.forEach(category => {
		const option = document.createElement("option");
		option.value = category;
		option.innerText = category;
		categorySelect.appendChild(option);
	  });
	}
  
	applyFilters() {
	  const search = document.getElementById("search-box") as HTMLInputElement;
	  const categorySelect = document.getElementById("categ-list") as HTMLSelectElement;
	  const minPrice = document.getElementById("min-price") as HTMLInputElement;
	  const maxPrice = document.getElementById("max-price") as HTMLInputElement;
  
	  this.filteredItems = this.allItems.filter(item => {
		return (
		  (!search.value.toLowerCase() || item.title.toLowerCase().includes(search.value.toLowerCase())) &&
		  (categorySelect.value === "All Categories" || item.category === categorySelect.value) &&
		  (!minPrice.value || item.price >= parseFloat(minPrice.value)) &&
		  (!maxPrice.value || item.price <= parseFloat(maxPrice.value))
		);
	  });
  
	  this.createItemsElement(); // Update displayed items after filtering
	}
  }
  