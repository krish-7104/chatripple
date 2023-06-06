import React, {createContext, useState} from 'react';
const UserContext = createContext();

const UserState = props => {
  const [data, setData] = useState({});
  const [notify, setNotify] = useState([]);

  return (
    <UserContext.Provider value={{data, setData, notify, setNotify}}>
      {props.children}
    </UserContext.Provider>
  );
};

export {UserState, UserContext};
