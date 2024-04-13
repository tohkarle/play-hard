import { useState } from 'react';

const useEmailValidator = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Regular expression pattern for email validation
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    // Check if the new email matches the pattern
    const isValid = emailPattern.test(newEmail);
    setIsValidEmail(isValid);
  };

  return { email, isValidEmail, handleEmailChange };
};

export default useEmailValidator;