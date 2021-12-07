import { useState } from 'react';

const useUser = () => {
  
  const getUser = () => {
    const userString = localStorage.getItem('user');
    const userObj = JSON.parse(userString);
    return userObj
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