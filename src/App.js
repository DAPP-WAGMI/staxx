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
import Wallet from "./components/Wallet";
import Button from "./components/Button";

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
    justify-content: end;
    padding: 0.5em;
`

function App() {
    const { setAuthToken } = useWallet()
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
                    <Nav>
                        {profile.id && <Button onClick={handleLogout}>Logout</Button>}
                    </Nav>
                    <Routes>
                        <Route path="/" element={<Container><Home profile={profile} /></Container>}/>
                        <Route path="board" element={<Outlet/>}>
                            <Route path=":postId" element={<Container><Post /></Container>} />
                        </Route>
                        <Route path="new" element={<Container><NewBoard profile={profile} /></Container>}/>
                    </Routes>
                </ThemeProvider>
            </ApolloProvider>
    );
}

export default App;
