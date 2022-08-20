import { useEffect, useState } from 'react'
import { useWallet } from '../utils/wallet'
import { useLazyQuery } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Curate from '../components/Curate'
import Compose from '../components/Compose'
import { GET_TIMELINE } from '../utils/queries'

const Container = styled.div`
    border-radius: 8px;`

function NewBoard({ profile, ...props }) {
    const { wallet, provider } = useWallet()
    
    return <Container>
        <h2>New Staxx</h2>
        <Compose profileId={profile.id} />
    </Container>
}

export default NewBoard