import { createCampaign, dashboard, profile, logout } from '../assets';

export const navlinks = [
  {
    name: 'Marketplace',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'Mint NFT',
    imgUrl: createCampaign,
    link: '/mint',
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];
