import { useState, useEffect } from 'react'
import { useWallet } from '../utils/wallet'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import { create } from 'ipfs-http-client'
import Button from './Button'
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
    const { wallet, provider, lensHub } = useWallet()
    // const [selectedFile, setSelectedFile] = useState({})
    const [name, setName] = useState('')
    const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)
    const [broadcast, broadcastData] = useMutation(BROADCAST)

    const handleClick = async () => {
        console.log('post board, profileid:', profileId)
        if (!name) return;

        const metadata = {
            version: '2.0.0',
            metadata_id: uuidv4(),
            description: `${name} #staxx`,
            content: `${name} #staxx`,
            external_url: `https://staxxxxx.xyz/`,
            image: null,
            imageMimeType: null,
            name: `Board by ${profileId}`,
            mainContentFocus: 'TEXT_ONLY',
            contentWarning: null, // TODO
            attributes: [
              {
                traitType: 'string',
                key: 'type',
                value: 'board'
              }
            ],
            media: [],
            locale: 'en',
            createdOn: new Date(),

            // name: `board by ${profileId}`,
            // description,
            // content: description,
            // external_url: null,
            // image: null,
            // imageMimeType: null,
            // version: "1.0.0",
            appId: 'staxx',
            // attributes: [],
            // media: [],
            // metadata_id: uuidv4(),
        }

        if (!profileId) {
            console.log('login first')
            return;
        }

        const ipfsResult = await client.add(JSON.stringify(metadata))
        console.log(ipfsResult.path)

        const createPostRequest = {
            profileId,
            contentURI: 'ipfs://' + ipfsResult.path,
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

    useEffect(() => {
        const processPost = async (data) => {
            const { domain, types, value } = data.typedData

            const signature = await wallet.signer._signTypedData(
                omitDeep(domain, '__typename'),
                omitDeep(types, '__typename'),
                omitDeep(value, '__typename'),
            )

            // setSavedTypedData({
            //     ...data.typedData,
            //     signature,
            // })

            // broadcast({
            //     variables: {
            //         request: {
            //             id: data.id,
            //             signature,
            //         }
            //     }
            // })

            const { v, r, s } = utils.splitSignature(signature);

            const tx = await lensHub.postWithSig({
                profileId: data.typedData.value.profileId,
                contentURI: data.typedData.value.contentURI,
                collectModule: data.typedData.value.collectModule,
                collectModuleInitData: data.typedData.value.collectModuleInitData,
                referenceModule: data.typedData.value.referenceModule,
                referenceModuleInitData: data.typedData.value.referenceModuleInitData,
                sig: {
                    v,
                    r,
                    s,
                    deadline: data.typedData.value.deadline,
                },
            });

            console.log(tx)

            setName('')

        }
        if (typedPostData.data) processPost(typedPostData.data.createPostTypedData);

    }, [typedPostData.data])

    const handleChange = (e) => {
        setName(e.target.value)
    }
    
    return <>
        <div> 
            <h2>New Staxx</h2>
            <input type="text" onChange={handleChange}/>
            <br/>
            <Button onClick={handleClick}>
                Create Staxx
            </Button>
        </div> 
    </>
}

export default Compose