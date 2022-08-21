import { useEffect, useState } from 'react'
import { useWallet } from '../utils/wallet'
import { useLazyQuery } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Curate from '../components/Curate'
import Compose from '../components/Compose'
import { RoundedButton } from '../components/Button'
import Card from '../components/Card'
import { GET_TIMELINE, SEARCH } from '../utils/queries'
import Gradient from '../assets/gradient.png'


const Container = styled.div`
    border-radius: 8px;`

const StaxxPreview = styled(Card)`
    color: white;
    background: url(${Gradient});
    background-size: cover;
    margin-bottom: 1.8em;
    span {
        font-weight: 600;
        font-size: 1.22em;
    }
    position: relative;
`
    
const InnerBox = styled.div``

const StyledImage = styled.img`

`

const Buttons = styled.div`
    position: absolute;
    right: 2em;
    margin-top: 0.5em;
    display: flex;
    gap: 0.6em;
`

function Home({ profile, ...props }) {
    const { wallet, provider } = useWallet()
    const [getSearch, searchData] = useLazyQuery(SEARCH)
    const [publications, setPublications] = useState([])

    useEffect(() => {
        if (!profile.id) return '';

        getSearch({
            variables: {
                request: { query: 'staxx',
                type: 'PUBLICATION', },
                reactionRequest: { profileId: profile.id },
            },
        })
    }, [getSearch, profile])


    useEffect(() => {
        if (!searchData.data) return;

        if (searchData.data.search.items.length < 1) {
            return;
        }

        console.log('search loaded')

        console.log(searchData.data)

        const pubIds = {}
        const pubs = []

        searchData.data.search.items.forEach((post) => {
            if (pubIds[post.id]) return;
            else {
                pubIds[post.id] = true
                pubs.push(post)
            }
        })

        setPublications(pubs);
        console.log(pubs)
        
    }, [searchData.data]);
    
    return <Container>
        {
            publications
                // .filter(pub => pub.collectedBy)
                .map(pub => {
                    return <Link key={pub.id} to={`/board/${pub.id}`}>
                        <StaxxPreview>
                            <span>{pub.metadata.content?.replace('#staxx', '')}</span>
                            {pub.profile.handle}
                            <Buttons>
                                <RoundedButton>save</RoundedButton>
                                <RoundedButton>reply</RoundedButton>
                            </Buttons>
                        </StaxxPreview>
                    </Link>
            })
        }
    </Container>
}

export default Home