import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "./PaymentForm";

export const StripeContainer = (props) => {
  const PUBLIC_KEY =
    "pk_test_51JH1p7KlckvcV53ylNrdtoopa8lsZDivFaf4367cbaPKenIxKsPqjNVO3O6it0yD3S9yyP6YDdWWjG9XejRBNS9d00Qet0vrXr";

  const stripePromise = loadStripe(PUBLIC_KEY);
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={props.amount} />
    </Elements>
  );
};
