import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        "https://shop-c4acb-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong !");
      }

      const resData = await response.json();

      //console.log(resData);

      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          (product) => product.ownerId === getState().auth.userId
        ),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    await fetch(
      `https://shop-c4acb-default-rtdb.firebaseio.com/products/${productId}.json?auth=${
        getState().auth.token
      }`,
      {
        method: "DELETE",
      }
    );
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const response = await fetch(
      `https://shop-c4acb-default-rtdb.firebaseio.com/products.json?auth=${
        getState().auth.token
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: getState().auth.userId,
        }),
      }
    );

    const resData = await response.json();

    console.log(resData);

    dispatch({
      type: CREATE_PRODUCT,
      product: {
        id: resData.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        ownerId: getState().auth.userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const response = await fetch(
      `https://shop-c4acb-default-rtdb.firebaseio.com/products/${id}.json?auth=${
        getState().auth.token
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong! ");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      product: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
  };
};
