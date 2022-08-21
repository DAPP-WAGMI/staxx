import React from "react";
import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import User from '../assets/user.png'
import { RoundedButton } from '../components/Button'
import { GET_TIMELINE, SEARCH, GET_PUBLICATIONS } from '../utils/queries'
import { Staxx } from './Home'

const H1 = styled.h1`
    padding: 0;
    margin: 0;
`

const Container = styled.div`
    padding: 0 1em;
    display: flex;
    gap: 1em;
    align-items: center;
`

const StyledRoundedButton = styled(RoundedButton)`
    margin-left: auto;
    height: 35px;
`

const Img = styled.img`
    border-radius: 100em;
    height: 80px;
`

const P = styled.p`
    margin: 0;
`

function Profile({ profile }) {
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

    return (
    <>
      <Container>
        <Img src={User} />
        <div>
            <H1>Gaiaa</H1>
            <P>@gaiaa.test</P>
        </div>
        <StyledRoundedButton>follow</StyledRoundedButton>
      </Container>
      <br/>
      {
            publications
                .filter(pub => pub.profile.handle === 'gaiaa.test')
                .map(pub => {
                    // console.log(pub.profile.handle)
                    return <Link key={pub.id} to={`/board/${pub.id}`}>
                        <Staxx pub={pub}/>
                    </Link>
            })
        }
      </>
    );
  }

export default Profile