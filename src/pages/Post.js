import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '../utils/queries'
import Compose from '../components/Compose'
import Card from '../components/Card'
import { useWallet } from '../utils/wallet'
import People from '../assets/people.png'
import Gradient from '../assets/gradient.png'

const StyledCard = styled(Card)`
    margin-bottom: 1em;
    background: #1642AA;
    background: url(${Gradient});
    background-size: cover;

    h2 {
        margin-bottom: 0;
    }
`
const StyledIcon = styled.img`
    height: 20px;
`

const Stat = styled.span`
    font-size: 0.8em;
`

const StyledImg = styled.img`
    max-width: 100%;
    margin-bottom: 1em;
`

function Post({ profileId, profileName }) {
    const { wallet } = useWallet()
    let params = useParams();
    const [publication, setPublication] = useState({})
    const [notFound, setNotFound] = useState(false)
    const [comments, setComments] = useState([]);
    const [isCommunity, setIsCommunity] = useState(false)

    const [getPublication, publicationData] = useLazyQuery(GET_PUBLICATION)
    const [getPublications, publicationsData] = useLazyQuery(GET_PUBLICATIONS)

    useEffect(() => {
        getPublication({
            variables: {
                request: { publicationId: params.postId },
                reactionRequest: profileId ? { profileId } : null,
            },
        });
    }, [profileId])

    useEffect(() => {
        if (!publicationData.data) return;
        if (!publicationData.data.publication) {
            setNotFound(true)
            return
        };

        setPublication({...publication, ...publicationData.data.publication})
        // publicationData.data.publication.metadata?.attributes.forEach(attribute => {
        //     if(attribute.value === 'community') {
        //         setIsCommunity(true)
        //     }
        // })
    }, [publicationData.data])
    
    useEffect(() => {
        getPublications({
            variables: {
                request: {
                    commentsOf: params.postId
                },
            },
        });
    }, [getPublications, params.postId])

    
    useEffect(() => {
        if (!publicationsData.data) return;

        setComments(publicationsData.data.publications.items);

    }, [wallet.address, publicationsData.data]);


    return <>
        <StyledCard>
            <h2>{publication.metadata && publication.metadata.content.replace('#staxx','')}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <StyledIcon src={People}/>
                <Stat>&nbsp;&nbsp;67</Stat>
            </div>
            <br/>
            {comments.map((post) => {
                const src = post.metadata.media[0].original?.url?.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
                return <StyledImg src={src} key={post.id} />;
            })}
        </StyledCard>
    </>
}

export default Post