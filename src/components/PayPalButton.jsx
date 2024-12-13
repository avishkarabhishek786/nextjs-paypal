'use client';
import React, { useEffect } from 'react';
import { loadScript } from '@paypal/paypal-js';

const PayPalButton = ({ amount, onSuccess, onError }) => {
  useEffect(() => {
    const initializePayPal = async () => {
      try {
        const paypal = await loadScript({
          'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: 'USD', // Change currency if needed
        });

        if (!paypal) {
          console.error('PayPal SDK failed to load.');
          return;
        }

        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount, // Pass the dynamic amount here
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              console.log('Transaction completed:', details);
              onSuccess(details); // Call the success handler
            });
          },
          onError: (err) => {
            console.error('Error with PayPal transaction:', err);
            onError(err); // Call the error handler
          },
        }).render('#paypal-button-container');
      } catch (error) {
        console.error('PayPal initialization failed:', error);
      }
    };

    initializePayPal();
  }, [amount, onSuccess, onError]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
