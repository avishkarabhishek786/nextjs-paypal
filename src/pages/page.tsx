import React from 'react';
import PayPalButton from '../components/PayPalButton';

const Home: React.FC = () => {
  const handleSuccess = (details: any) => {
    console.log('Transaction completed by:', details.payer.name.given_name);
    alert(`Transaction completed by ${details.payer.name.given_name}`);
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    alert('An error occurred with PayPal checkout.');
  };

  return (
    <div>
      <h1>PayPal Checkout Integration</h1>
      <p>Click the button below to complete your payment:</p>
      <PayPalButton amount="20.00" onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Home;
