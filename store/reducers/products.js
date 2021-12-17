import PRODUCTS from "../../data/dummy-data";
import { DELETE_PRODUCT } from "../actions/products";

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
  }
  return state;
};

export default ProductsReducer;
