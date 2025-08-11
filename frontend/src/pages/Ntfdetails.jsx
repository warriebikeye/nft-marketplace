import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrowserProvider, Contract } from 'ethers';
import { thirdweb } from '../assets';
import { CustomButton, Loader } from '../components';
import MarketplaceJson from '../contracts/Marketplace.json';

const MARKETPLACE_ADDRESS = '0xdaAC8E7772BEd8CA0E9afF2E3f86d18435C279E5';

const Nftdetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const { state } = useLocation();
  const item = state?.item;

  if (!item) {
    return <p>No item found</p>;
  }

  const handleBuy = async (itemId, price) => {
    try {
      setIsLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplace = new Contract(MARKETPLACE_ADDRESS, MarketplaceJson.abi, signer);

      const totalPrice = await marketplace.getTotalPrice(itemId);
      await marketplace.purchaseItem(itemId, { value: totalPrice });

      alert('NFT Purchased!');
      navigate('/profile'); // redirect after buying
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('' + err.code + '\nPlease try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-5 mb-5 gap-[40px] pl-20 sm:pl-5 pr-20 sm:pl-5 pt-5">
        <div className="flex-1 flex-col">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        
        <div className="flex-[2] flex flex-col gap-[40px]">
          <h4 className="font-epilogue mb-[5px] font-semibold text-[20px] text-white uppercase">
              {item.name}
            </h4>
            
            <p className="mt-[5px] mb-[15px] font-epilogue font-semibold text-[16px] text-[#808191]">
              {item.price} ETH
            </p>
          <div>
            
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Creator
            </h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                  {item.owner}
                </h4>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              About
            </h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">

          <div className="mt-[20px] mb-10 flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <div className="mt-[5px]">
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] text-white">
                  Buy it because you love in it.
                </h4>
              </div>

              <CustomButton
                btnType="button"
                title="Buy"
                styles="w-full bg-[#8c6dfd]"
                handleClick={() => handleBuy(item.itemId, item.price)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nftdetails;
