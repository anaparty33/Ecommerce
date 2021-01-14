import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants.js";

const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      const existedItem = state.cartItems.find(
        (ele) => ele.product === item.product
      );

      if (existedItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((ele) =>
            ele.product === existedItem.product ? item : ele
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (ele) => ele.product !== action.payload
        ),
      };

    case CART_SAVE_SHIPPING_ADDRESS: {
      return { ...state, shippingAddress: action.payload };
    }

    case CART_SAVE_PAYMENT_METHOD: {
      return {
        ...state,
        paymentMethod: action.payload,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
