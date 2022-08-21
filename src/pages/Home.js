import { useEffect, useState } from 'react'
import { useWallet } from '../utils/wallet'
import { useLazyQuery, useMutation } from '@apollo/client'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Curate from '../components/Curate'
import Compose from '../components/Compose'
import { RoundedButton } from '../components/Button'
import Card from '../components/Card'
import { CREATE_COLLECT_TYPED_DATA, SEARCH, GET_TIMELINE, GET_PUBLICATIONS } from '../utils/queries'
import Gradient from '../assets/gradient.png'

const Container = styled.div`
    border-radius: 8px;`

const StaxxPreview = styled(Card)`
    color: white;
    background: url(${Gradient});
    background-size: cover;
    background-attachment: fixed;
    margin-bottom: 2.4em;
    span {
        font-weight: 600;
        font-size: 1.22em;
    }
    position: relative;
`
    
const StyledImg = styled.img`
    height: 180px;
    margin-bottom: 1em;
`

const Scrollarea = styled.div`
    margin-top: 0.6em;
    display: flex;
    gap: 0.9em;
    overflow: scroll;
`

const InnerBox = styled.div``

const Buttons = styled.div`
    position: absolute;
    bottom: -1em;
    right: 1em;
    display: flex;
    gap: 0.6em;
`

export const Staxx = ({ pub }) => {
    const { wallet, lensHub } = useWallet()
    const [comments, setComments] = useState([])
    const [getPublications, publicationsData] = useLazyQuery(GET_PUBLICATIONS)
    const [createCollectTyped, createCollectTypedData] = useMutation(CREATE_COLLECT_TYPED_DATA)

    useEffect(() => {
        getPublications({
            variables: {
                request: {
                    commentsOf: pub.id
                },
            },
        });
    }, [])
    
    useEffect(() => {
        if (!publicationsData.data) return;

        setComments(publicationsData.data.publications.items);

    }, [publicationsData.data]);

    const handleSave = async (e) => {
        e.stopPropagation()

        const collectReq = {
            publicationId: pub.id,
        };

        try {
            await createCollectTyped({
                variables: {
                    request: collectReq,
                },
            });
        }
        catch (err) {
            alert(err)
            // setApiError(apiError)
        }
    }
    useEffect(() => {
        if (!createCollectTypedData.data) return;

        const handleCreate = async () => {

            const typedData = createCollectTypedData.data.createCollectTypedData.typedData;

            const { domain, types, value } = typedData;

            const signature = await wallet.signer._signTypedData(
                omitDeep(domain, "__typename"),
                omitDeep(types, "__typename"),
                omitDeep(value, "__typename")
            );


            const { v, r, s } = utils.splitSignature(signature);

            const tx = await lensHub.collectWithSig({
                collector: wallet.address,
                profileId: typedData.value.profileId,
                pubId: typedData.value.pubId,
                data: typedData.value.data,
                sig: {
                  v,
                  r,
                  s,
                  deadline: typedData.value.deadline,
                },
              },
              { gasLimit: 1000000 }
              );
            
            console.log('collect: tx hash', tx.hash);
            // await pollUntilIndexed(tx.hash)
            // console.log('collect: success')
            // setToastMsg({ type: 'success', msg: 'Transaction indexed' })

        }
        handleCreate();

    }, [createCollectTypedData.data]);

    return <div style={{ position: 'relative' }}>
    <Link to={`/board/${pub.id}`}>
        <StaxxPreview>
            <span>{pub.metadata.content?.replace('#staxx', '')}</span>
            <Link to="profile" style={{ color: 'white' }}>{pub.profile.handle} ✦</Link>
            <Scrollarea>
            {comments.map((post) => {
                    const src = post.metadata.media[0].original?.url?.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')
                    return <StyledImg src={src} key={post.id} />;
                })}
            </Scrollarea>
        </StaxxPreview>
    </Link>
    <Buttons>
        <RoundedButton onClick={handleSave}>save</RoundedButton>
        <RoundedButton>reply</RoundedButton>
    </Buttons>
    </div>
}

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
                    return <Staxx key={pub.id} pub={pub}/>
            })
        }
    </Container>
}

export default Home