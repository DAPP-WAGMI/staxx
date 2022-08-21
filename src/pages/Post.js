import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS, CREATE_COMMENT_TYPED_DATA } from '../utils/queries'
import Compose from '../components/Compose'
import Card from '../components/Card'
import { useWallet } from '../utils/wallet'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
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

const Span = styled.p`
    color: black;
    background: white;
    font-size: 1.6em;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1em;
    border-radius: 40em;
    position: absolute;
    right: 0.5em;
    bottom: 1em;
`

const BoardPicker = styled.div`
    background: black;
    padding: 1em 4em 1em 2em;
    position: absolute;
    text-align: right;
    right: -0.25em;
    bottom: 1em;
`

const Pin = ({ post, profileId }) => {
    const { wallet } = useWallet()
    const [revealBoards, setRevealBoards] = useState(false)
    const [mutateCommentTypedData, typedCommentData] = useMutation(CREATE_COMMENT_TYPED_DATA)

    useEffect(() => {
        const processPost = async (data) => {
            const { domain, types, value } = data.typedData

            const signature = await wallet.signer._signTypedData(
                omitDeep(domain, '__typename'),
                omitDeep(types, '__typename'),
                omitDeep(value, '__typename'),
            )

        }
        if (typedCommentData.data) processPost(typedCommentData.data.createCommentTypedData);

    }, [typedCommentData.data])

    const src = post.metadata.media[0].original?.url?.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
    return <div style={{ position: 'relative' }}>
        {revealBoards && <BoardPicker onClick={() => setRevealBoards(!revealBoards)}>
            <h4>add to stax</h4>
            <p onClick={() => mutateCommentTypedData({
                variables: {
                    request: {
                        profileId,
                        publicationId: '0x0244-0x10',
                        contentURI: 'ipfs://' + 'ipfsResult.path',
                        collectModule: {
                            freeCollectModule: { 
                                followerOnly: false 
                            },
                        },
                        referenceModule: {
                            followerOnlyReferenceModule: false,
                        },
                    } ,
                }
            })}>solarpunk</p>
            <p>antifashion</p>
            <p>architecture</p>
        </BoardPicker>}
        <Span onClick={() => setRevealBoards(!revealBoards)}>+</Span>
        <StyledImg src={src} key={post.id} />
    </div>
}

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
                return <Pin key={post.id} post={post} profileId={profileId} />
            })}
        </StyledCard>
    </>
}

export default Post