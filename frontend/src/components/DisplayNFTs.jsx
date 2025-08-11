import React from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import Nftcard from './Nftcard'; // Assuming you have a utility function for buying items
import { loader } from '../assets';

const DisplayNFTs = ({ title, isLoading, items }) => {
    const navigate = useNavigate();

  const handleNavigate = (item) => {
    //navigate(`/nft-details/${item.}`, { state: item })
    navigate("/nft-details", { state: { item } });
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({items.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && items.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No NFTs available yet
          </p>
        )}

        {!isLoading && items.length > 0 && items.map((item) => <Nftcard 
          key={uuidv4()}
          {...item}
          handleClick={() => handleNavigate(item)}
        />)}
      </div>
    </div>
  )
}

export default DisplayNFTs