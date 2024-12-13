'use client';

import React, { useEffect } from 'react';
import { loadScript, PayPalNamespace } from '@paypal/paypal-js';

interface PayPalButtonProps {
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ onSuccess, onError }) => {
  useEffect(() => {
    const initializePayPal = async () => {
      try {
        const paypal = await loadScript({
          'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
          currency: 'USD',
        });

        if (!paypal) {
          console.error('PayPal SDK failed to load.');
          return;
        }

        paypal.Buttons({
          createOrder: async () => {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', // Ensure the correct content type
                },
                body: JSON.stringify({ amount: '20.00' }), // Properly send the amount as JSON
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create order');
            return data.id;
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              console.log('Transaction completed:', details);

              const verifyResponse = await fetch('/api/verifypayments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderID: data.orderID }),
              });

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok) {
                throw new Error(verifyData.error || 'Payment verification failed');
              }

              console.log('Payment verified:', verifyData);
              onSuccess(verifyData);
            } catch (error) {
              console.error('Verification error:', error);
              onError(error);
            }
          },
          onError: (error) => {
            console.error('PayPal error:', error);
            onError(error);
          },
        }).render('#paypal-button-container');
      } catch (error) {
        console.error('Failed to initialize PayPal:', error);
      }
    };

    initializePayPal();
  }, [onSuccess, onError]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
