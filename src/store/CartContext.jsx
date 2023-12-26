import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {}
});

function CartReducer(state, action) {
  // state and action will provide these arguments
  // the action object will tell react how to update the state.
  switch (action.type) {

    case "ADD_ITEM":

      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      ); // returns -1 if false but also the id

      const updatedItems = [...state.items]; // this way you make a copy of the old array

      if (existingCartItemIndex > -1) { // so it already exists
        const existingItem = state.items[existingCartItemIndex] // find the item in the array
        const updatedItem = {
            ...existingItem,
            quantity: existingItem.quantity + 1
        }
        // after the above we need to re-insert the updatedItem in the updatedItemS array!
        updatedItems[existingCartItemIndex] = updatedItem; // we overwrite it with the new item.

      } else { // or when we need to add a new item to the array...
        updatedItems.push({...action.item, quantity: 1}); // and add the new item to the copy
        // all the new items that get added also get a quantity property set to 1.
      }
      // return the updated state... which is a new object...
      return {...state, items: updatedItems}; // overwrite the items object with the new updatedItems object.

      case "REMOVE_ITEM":
        const existingCartItemIndexRemove = state.items.findIndex(
          (item) => item.id === action.id
        );
        const existingCartItem = state.items[existingCartItemIndexRemove];
        let updatedItemsRemove;
      
        if (existingCartItem.quantity === 1) {
          updatedItemsRemove = [...state.items];
          updatedItemsRemove.splice(existingCartItemIndexRemove, 1);
        } else {
          updatedItemsRemove = [...state.items];
          const updatedItem = {
            ...existingCartItem,
            quantity: existingCartItem.quantity - 1
          };
          updatedItemsRemove[existingCartItemIndexRemove] = updatedItem;
        }
        return { ...state, items: updatedItemsRemove };
      
      
  }

  if (action.type === 'CLEAR_CART') {
    return {...state, items: []};
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(CartReducer, { items: [] }); //pass the function as a first argument, second argument the initial state
  
  function addItem(item) {
    dispatchCartAction({type: 'ADD_ITEM', item})
  }

  function removeItem(id) {
    dispatchCartAction({type: 'REMOVE_ITEM', id})
  }

  function clearCart() {
    dispatchCartAction({type: 'CLEAR_CART'})
  }


  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  }
  console.log(cartContext);
  return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>;
}

export default CartContext;
