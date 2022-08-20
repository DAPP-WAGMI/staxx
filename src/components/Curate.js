import { useEffect } from 'react'
import { useWallet } from '../utils/wallet'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Button from './Button'

function Curate({ ...props }) {
    // const { wallet, provider } = useWallet()
    const handleClick = () => {
        console.log('hey')
    }
    
    return <Button onClick={handleClick}>
        Curate
    </Button>
}

export default Curate