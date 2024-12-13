'use client'

import React from 'react';
import PayPalButton from '../components/PayPalButton';

const Home: React.FC = () => {
  const handleSuccess = (details: any) => {
    console.log(details)
    const fullname = details.orderDetails.payer.name.given_name + ' ' + details.orderDetails.payer.name.surname;
    console.log('Transaction completed by:', fullname);
    alert(`Transaction completed by ${fullname}`);
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    alert('An error occurred with PayPal checkout.');
  };

  return (
    <div>
      <h1>PayPal Checkout Integration</h1>
      <p>Click the button below to complete your payment:</p>
      <PayPalButton onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Home;
