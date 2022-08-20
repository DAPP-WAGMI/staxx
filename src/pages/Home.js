import { useEffect } from 'react'
import { useWallet } from "../utils/wallet";
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled.div`
    border-radius: 8px;`;

function Home({ ...props }) {
    const { wallet, provider } = useWallet()
    
    return <Container>
        hey
    </Container>
}

export default Home