// scripts/uploadToIPFS.js
const { Web3Storage, File } = require('web3.storage');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}

async function upload(filePath) {
  const client = makeStorageClient();
  const content = fs.readFileSync(filePath);
  const files = [new File([content], path.basename(filePath))];
  const cid = await client.put(files);
  console.log('Stored files with CID:', cid);
  return `https://${cid}.ipfs.dweb.link/${path.basename(filePath)}`;
}

// Example usage:
// upload('nfts/image1.png')
