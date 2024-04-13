import { useState } from 'react';

const usePasswordValidator = () => {
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Password validation pattern (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const isValid = passwordPattern.test(newPassword);
    setIsValidPassword(isValid);
  };

  return { password, isValidPassword, handlePasswordChange };
};

export default usePasswordValidator;