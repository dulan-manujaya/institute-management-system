import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import globalVariables from "../common/globalVariables";

export const PaymentForm = (props) => {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": { color: "#fce883" },
        "::placeholder": { color: "# 87bbfd" },
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "ffc7ee",
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          `${globalVariables.apiServer}/api/v1/payments/stripe`,
          {
            amount: props.amount,
            id,
          }
        );
        if (response.data.success) {
          console.log("Payment made");
          setSuccess(true);
        }
      } catch (error) {
        console.log("error: " + error);
      }
    } else {
      console.log("Error" + error.message);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button>Pay</button>
        </form>
      ) : (
        <div>
          <h2>Payment success</h2>
        </div>
      )}
    </>
  );
};
