// AddressContext.jsx
import { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const AddressProvider = ({ children,initialAccount }) => {
  const [address, setAddress] = useState(initialAccount || null);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
