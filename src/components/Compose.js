import { useState, useEffect } from 'react'
import { useWallet } from '../utils/wallet'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import Button from './Button'
import { create } from 'ipfs-http-client'
import { CREATE_POST_TYPED_DATA, CREATE_COMMENT_TYPED_DATA, BROADCAST } from '../utils/queries'

const client = create({
    protocol: 'https',
    host: 'ipfs.infura.io', 
    port: '5001',
    path: '/api/v0',
    headers: {
      authorization: 'Basic ' +  window.btoa('26JsrucCKgQZxquUitySbZrwAFq:5658da665537ef8395f07a112b752a6a')
    },
})

function Compose({ profileId, ...props }) {
    // const { wallet, provider } = useWallet()
    const [selectedFile, setSelectedFile] = useState({})
    const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)

    const handleClick = async () => {
        console.log('upload')
        console.log(selectedFile)
        const media = await client.add(selectedFile)
        console.log(media)

        const description = 'topic'

        const metadata = {
            name: `post by ${profileId}`,
            description,
            content: description,
            external_url: null,
            image: null,
            imageMimeType: null,
            version: "1.0.0",
            appId: 'iris',
            attributes: [],
            media: [],
            metadata_id: uuidv4(),
        }

        if (!profileId) {
            console.log('login first')
            return;
        }

        const createPostRequest = {
            profileId,
            contentURI: 'ipfs://' + 'ipfsResult.path',
            collectModule: {
                freeCollectModule: { 
                    followerOnly: false
                },
            },
            referenceModule: {
                followerOnlyReferenceModule: false,
            },
        };

        mutatePostTypedData({
            variables: {
                request: createPostRequest,
            }
        })



    }

    const onFileChange = (e) => {
        // console.log(e.target.files[0])
        setSelectedFile(e.target.files[0])
    }
    
    return <>

        <div> 
            <input type="file" onChange={onFileChange} /> 
            <Button onClick={handleClick}>
                Create Board
            </Button>
        </div> 
    </>
}

export default Compose