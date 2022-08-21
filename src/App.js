import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import './App.css'
import ApolloProvider from "./components/Apollo";
import Card from "./components/Card";
import { useWallet } from "./utils/wallet";
import GlobalStyle from "./theme/GlobalStyle";
import ThemeProvider from "./theme/ThemeProvider";
import Home from "./pages/Home";
import NewBoard from "./pages/NewBoard";
import Outlet from "./pages/Outlet";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Wallet from "./components/Wallet";
import Button from "./components/Button";
import Logo from './assets/logo.png'

const Container = styled.div`
    padding: 1em;
`
// const Container = styled(Card)`
//     max-width: 500px;
//     margin: auto;
//     margin-bottom: 4em;
//     @media (max-width: 768px) {
//       margin: 0.5em;
//       margin-bottom: 3.6em;
//       margin-top: 0em;
//     }
// `

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 0.5em;
`

const Pagelist = styled.div`
    display: flex;
    justify-content: flex-end;
    align-content: center;
    gap: 1em;
    padding: 0.5em;
    a {
        color: white;
    }
`

function App() {
    const { setAuthToken } = useWallet()
    const [showNav, setShowNav] = useState(false)
    const [profile, setProfile] = useState({})

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        window.location.reload()
    }

    return (
            <ApolloProvider>
                <ThemeProvider>
                    <GlobalStyle />
                    <Wallet setProfile={setProfile} profile={profile}/>
                    {profile.id && <Nav>
                        <img height="40px" src={Logo} onClick={() => setShowNav(!showNav)} />
                        <div>
                            {profile.handle}✦&nbsp;
                            <Button onClick={handleLogout}>Logout</Button>
                        </div>
                    </Nav>}
                    {showNav && <Pagelist>
                        <Link onClick={() => setShowNav(false)} to="profile">profile</Link>
                        <Link onClick={() => setShowNav(false)} to="/">feed</Link>
                        <Link onClick={() => setShowNav(false)} to="new">new</Link>
                    </Pagelist>}
                    <Routes>
                        <Route path="/" element={<Container><Home profile={profile} /></Container>}/>
                        <Route path="board" element={<Outlet/>}>
                            <Route path=":postId" element={<Container><Post profileId={profile.id} /></Container>} />
                        </Route>
                        <Route path="new" element={<Container><NewBoard profile={profile} /></Container>}/>
                        <Route path="profile" element={<Container><Profile profile={profile} /></Container>}/>
                    </Routes>
                </ThemeProvider>
            </ApolloProvider>
    );
}

export default App;
