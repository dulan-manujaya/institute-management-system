import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";

export const StripeContainer = (props) => {
  const PUBLIC_KEY =
    "pk_test_51JG35JAZL6aaSWRyLJXMQGH0RB9Tvj0Ffwnb7EBjXcPo6S0n7pbpOAbLseVTy2KcAXiZSOskqBHzKjIA20fH7bzU00R9GxEY0U";

  const stripePromise = loadStripe(PUBLIC_KEY);
  console.log(props.amount);
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={props.amount}
        createPayment={props.createPayment}
        closeModal={props.closeModal}
        latestPayment={props.latestPayment}
      />
    </Elements>
  );
};
