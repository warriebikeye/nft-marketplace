// src/components/MintForm.js
import { useState } from 'react';
import { BrowserProvider, Contract, parseEther } from 'ethers';
import NFTJson from '../contracts/NFT.json';
import MarketplaceJson from '../contracts/Marketplace.json';
import {money} from '../assets';
import { uploadFileToIPFS, uploadMetadata } from '../utils/ipfsUpload';

const NFT_ADDRESS = '0xCA521A6035F43840387f5210d75CC66BaA2F142a';
const MARKETPLACE_ADDRESS = '0xdaAC8E7772BEd8CA0E9afF2E3f86d18435C279E5';

function MintForm({ account }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const mintAndList = async () => {
    try {
      if (!file || !name || !desc || !price) {
        return alert('Fill all fields');
      }

      // Connect wallet
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Upload image and metadata to IPFS
      const imageUrl = await uploadFileToIPFS(file);
      const metadataUrl = await uploadMetadata(name, desc, imageUrl);

      // Mint NFT
      console.log('Minting NFT with metadata URL:', metadataUrl);
      const nft = new Contract(NFT_ADDRESS, NFTJson.abi, signer);
      const tx = await nft.mint(metadataUrl);
      const receipt = await tx.wait();

      const tokenId = receipt.logs[0].args[2].toString();

      // Approve marketplace
      console.log('Approving marketplace for token ID:', tokenId);
      const approveTx = await nft.approve(MARKETPLACE_ADDRESS, tokenId);
      await approveTx.wait();

      // List on marketplace
      console.log('Listing NFT on marketplace with price:', price);
      const marketplace = new Contract(MARKETPLACE_ADDRESS, MarketplaceJson.abi, signer);
      const priceInWei = parseEther(price);
      const listTx = await marketplace.makeItem(NFT_ADDRESS, tokenId, priceInWei);
      await listTx.wait();

      alert('✅ NFT Minted and Listed!');
    } catch (err) {
      console.error(err);
      alert('❌ Transaction failed. See console for details.');
    }
  };

  return (
  <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 space-y-6">
  {/* Info Box */}
  <div className="w-full max-w-[1000px] flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
    <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
    <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
      You will get 100% of the purchased amount
    </h4>
  </div>

  {/* Form */}
  <div className="w-full max-w-[1000px] flex justify-center">
    <div className="w-full md:w-[60%] flex flex-col p-4 bg-[#1c1c24] rounded-[20px] space-y-4">
      <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-2">Mint New NFT</h1>

      <input
        className="w-full border border-[#3b3b4f] rounded-[100px] min-h-[52px] px-4 font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <input
        className="w-full border border-[#3b3b4f] rounded-[100px] min-h-[52px] px-4 font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border border-[#3b3b4f] rounded-[100px] min-h-[52px] px-4 font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        placeholder="Description"
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        className="w-full border border-[#3b3b4f] rounded-[100px] min-h-[52px] px-4 font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        placeholder="Price in ETH"
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        className="w-full font-epilogue font-semibold text-[16px] leading-[26px] text-white bg-[#3b3b4f] hover:bg-[#505062] transition rounded-[100px] min-h-[52px]"
        onClick={mintAndList}
      >
        Mint & List
      </button>
    </div>
  </div>
</div>

  );
}

export default MintForm;
