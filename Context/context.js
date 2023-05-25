import React, {createContext, useEffect, useState} from 'react';
const UserContext = createContext();
import auth from '@react-native-firebase/auth';

const UserState = props => {
  const [data, setData] = useState({});
  const onAuthStateChanged = user => {
    if (!user) navigation.replace('Register');
    setData({
      ...data,
      email: user?.email,
      name: user?.displayName,
      image: user?.photoURL,
      uid: user?.uid,
    });
  };
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  return (
    <UserContext.Provider value={{data, setData}}>
      {props.children}
    </UserContext.Provider>
  );
};

export {UserState, UserContext};
