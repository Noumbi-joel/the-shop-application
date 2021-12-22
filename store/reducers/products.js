import PRODUCTS from "../../data/dummy-data";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS,
} from "../actions/products";
import Product from "../../models/product";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

const ProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter((p) => p.id !== action.pid),
        availableProducts: state.availableProducts.filter(
          (p) => p.id !== action.pid
        ),
      };

    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.products.filter((prod) => prod.ownerId === "u1"),
      };

    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.product.id,
        "u1",
        action.product.title,
        action.product.imageUrl,
        action.product.description,
        action.product.price
      );
      return {
        ...state,
        userProducts: state.userProducts.concat(newProduct),
        availableProducts: state.availableProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        "u1",
        action.product.title,
        action.product.imageUrl,
        action.product.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct;
      const availableProductIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
  }
  return state;
};

export default ProductsReducer;
