import { useEffect, useState } from 'react'
import { useWallet } from '../utils/wallet'
import { useLazyQuery } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Curate from '../components/Curate'
import Compose from '../components/Compose'
import { GET_TIMELINE } from '../utils/queries'
import Staxxpreview from '../assets/staxxpreview.png'

const Container = styled.div`
    border-radius: 8px;
    padding: 1em;
`

const Preview = styled.div`
    position: absolute;
    height: 300px;
    left: 0;
    width: 100vw;
    display: block;
    background: url(${Staxxpreview});
    background-size: cover;
`

function NewBoard({ profile, ...props }) {
    const { wallet, provider } = useWallet()
    
    return <Container>
        <h1>New Staxx</h1>
        <br/>
        Staxx name
        <Compose profileId={profile.id} />
        <br/>
        <br/>
        <br/>
        <br/>
        <Preview/>
    </Container>
}

export default NewBoard