import { useEffect, useState } from 'react'
import { useWallet } from '../utils/wallet'
import { useLazyQuery } from '@apollo/client'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Curate from '../components/Curate'
import Compose from '../components/Compose'
import { GET_TIMELINE, SEARCH } from '../utils/queries'

const Container = styled.div`
    border-radius: 8px;`

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
        hey
        <Curate/>
        <Compose profileId={profile.id} />
        {
            publications
                // .filter(pub => pub.collectedBy)
                .map(pub => {
                    return <p key={pub.id}>{pub.__typename}</p>
            })
        }
    </Container>
}

export default Home