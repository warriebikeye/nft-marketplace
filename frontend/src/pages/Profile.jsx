import { useEffect, useState } from 'react';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import DisplayNFTs from '../components/DisplayNFTs';
import NFTJson from '../contracts/NFT.json';
import MarketplaceJson from '../contracts/Marketplace.json';
import { useAddress } from '../context/AddressContext';

const NFT_ADDRESS = '0xCA521A6035F43840387f5210d75CC66BaA2F142a';
const MARKETPLACE_ADDRESS = '0xdaAC8E7772BEd8CA0E9afF2E3f86d18435C279E5';

const Profile = ({account}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const { address } = useAddress();

   const loadItems = async () => {
     setIsLoading(true);
    const provider = new BrowserProvider(window.ethereum);
    const marketplace = new Contract(MARKETPLACE_ADDRESS, MarketplaceJson.abi, provider);
    const nft = new Contract(NFT_ADDRESS, NFTJson.abi, provider);

    const itemCount = await marketplace.itemCount();
    let loadedItems = [];

    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold && item.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(item.tokenId);
        const res = await fetch(uri);
        const metadata = await res.json();

        loadedItems.push({
          itemId: item.itemId.toString(),
          price: formatEther(item.price),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }

    setItems(loadedItems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);
  return (
    <DisplayNFTs
      title="Your NFTs"
      isLoading={isLoading}
      items={items}
    />
  )
}

export default Profile