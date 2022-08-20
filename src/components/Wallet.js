import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'
import { useWallet } from '../utils/wallet'
import Login from './Login'

function Wallet({ setProfile = () => {}, ...props }) {
const { wallet, setWallet, setLensHub, authToken, setProvider } = useWallet()
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES)

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
    console.log(profiles.data.profiles.items[0])

    setProfile(profiles.data.profiles.items[0])

  }, [profiles.data])

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    const contract = new ethers.Contract('0x60Ae865ee4C725cd04353b5AAb364553f56ceF82', LensHub, signer)
    setLensHub(contract)
  
    provider.getBalance(address).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log({balanceInEth})
      setWallet({...wallet, signer, address, balanceInEth})
      })
  }

  useEffect(() => {
    connectWallet()
  }, [])
  
  return (
    
    <div>
    { wallet.signer ? 
    <Login/> : 
    <button onClick={connectWallet} >Connect Wallet</button>
    }
  </div>
  );
}

export default Wallet