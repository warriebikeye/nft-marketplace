// src/App.js
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ethers } from 'ethers';
import MintForm from './pages/MintForm';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { AddressProvider } from './context/AddressContext';
import Nftdetails from './pages/Ntfdetails';

function App() {

  const [account, setAccount] = useState(null);
  const connectWallet = async () => {
    if (window.ethereum) {
      const [selectedAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(selectedAccount);
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);
  return (

    <AddressProvider initialAccount={account}>
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row ">

        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <p className="float-right text-white hidden lg:block">
            Connected account: {account}
          </p>
          <Navbar />
          <Routes>
            <Route path="/" element={<Marketplace account={account} />} />
            <Route path="/mint" element={<MintForm account={account} />} />
            <Route path="/profile" element={<Profile account={account} />} />
            <Route path="/nft-details" element={<Nftdetails account={account} />} />
          </Routes>
        </div>

      </div>
    </AddressProvider>
  );
}

export default App;
