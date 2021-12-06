import { useState } from 'react';

const useUser = () => {
  
  const getUser = () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    return user
  };

  const [user, setUser] = useState(getUser());

  const saveUser = user => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  return [
    user,
    saveUser
  ]
}

export default useUser;