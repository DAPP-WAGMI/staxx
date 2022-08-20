import React, { useEffect } from 'react'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'
import { useWallet } from '../utils/wallet'
import Login from './Login'

function Wallet({ setProfiles = () => {}, ...props }) {
const { wallet, setWallet, setLensHub, authToken, setProvider } = useWallet()
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES)

  
  async function connect() {
    
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "30a44e55236e4a81af8cceb9cb3afc64" // required
        }
      }
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);

    const signer = provider.getSigner();
    // if (!process.env.REACT_APP_INFURA_ID) {
    //   throw new Error("Missing Infura Id");
    // }
    const web3Provider = new WalletConnectProvider({
      infuraId: "30a44e55236e4a81af8cceb9cb3afc64",
    });

    // web3Provider.on("disconnect", reset);

    const accounts = (await web3Provider.enable());
    // setAddress(accounts[0]);
    // setChainId(web3Provider.chainId);

    setProvider(provider);
    const address = await signer.getAddress()

    setWallet({...wallet, signer, address})
  }

  useEffect(() => {
    if (!authToken || !wallet.address) return;

    getProfiles({
      variables: {
        request: {
          // profileIds?: string[];
          ownedBy: wallet.address
          // handles?: string[];
          // whoMirroredPublicationId?: string;
        },
      },
     })

  }, [authToken, wallet.address])

  useEffect(() => {
    if (!profiles.data) return
    console.log(profiles.data.profiles.items)

    setProfiles(profiles.data.profiles.items)

  }, [profiles.data])


  // useEffect(() => {
  //   connectWallet()
  // }, [])
  
  return (
    
    <div>
    { wallet.signer ? 
    <Login/> : 
    <button onClick={connect} >Connect Wallet</button>
    }
  </div>
  );
}

export default Wallet