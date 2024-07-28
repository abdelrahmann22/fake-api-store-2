"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getItem = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://fakestoreapi.com/products";
    try {
        const response = yield fetch(url, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const items = yield response.json();
        return items;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
});
getItem()
    .then(items => {
    console.log(items);
});
console.log("Hello");
