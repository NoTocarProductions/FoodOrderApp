import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./UI/error";
  // we need to create this outside the function so this empty object doesn't get recreated everytime the meals commpoonent loads, it creates an infinite loop.

const requestConfig = {
  method: "POST",
  headers: {
         'Content-Type': 'application/json'
       },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.price * item.quantity,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    // fd.get('full-name'); --> this is one way of retrieving data easily through the built in formdata obj.
    const customerData = Object.fromEntries(fd.entries()); // { email: test@example.com }

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    );

    // BEFORE USING THE CUSTOM HOOK
    // _______________________________
    // fetch('http://localhost:3000/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     order: {
    //       items: cartCtx.items,
    //       customer: customerData
    //     }
    //   })
    // });
    // _______________________________
  }

  let actions = (
    <>
      <Button onClick={handleClose} type="button" textOnly>
        Close
      </Button>
      <Button>Submit</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>
  }

  if (data && !error) {
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <h2>Succes!</h2>
      <p>Your order was submitted succesfully!</p>
      <p>Check your email!</p>
      <p className="modal-actions">
        <Button onClick={handleFinish}>
          Okay
        </Button>
      </p>
    </Modal>
  }

  

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title='Failed to send data' message={error}/>}
        <p className="modal-actions">
          {actions}
        </p>
      </form>
    </Modal>
  );
}
