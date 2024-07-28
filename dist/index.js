import { Products } from "./modules/products.js";
console.log("Hello");
const products = new Products();
products.getItems()
    .then(items => console.log(items))
    .catch(error => console.error('Error fetching products:', error));
