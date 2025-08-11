import axios from 'axios';

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

export async function uploadFileToIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const data = new FormData();
  data.append('file', file);

  const res = await axios.post(url, data, {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${PINATA_JWT}`
    }
  });

  const cid = res.data.IpfsHash;
  console.log('Stored file with CID:', cid);
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

export async function uploadMetadata(name, description, imageUrl) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const metadata = {
    name,
    description,
    image: imageUrl
  };

  const res = await axios.post(url, metadata, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`
    }
  });

  const cid = res.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
