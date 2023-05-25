import React, {createContext, useState} from 'react';
const UserContext = createContext();

const UserState = props => {
  const [data, setData] = useState({});

  return (
    <UserContext.Provider value={{data, setData}}>
      {props.children}
    </UserContext.Provider>
  );
};

export {UserState, UserContext};
