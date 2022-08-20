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
import Wallet from "./components/Wallet";
import Button from "./components/Button";

const Container = styled(Card)`
    max-width: 500px;
    margin: auto;
    margin-bottom: 4em;
    @media (max-width: 768px) {
      margin: 0.5em;
      margin-bottom: 3.6em;
      margin-top: 0em;
    }
`

const Nav = styled.div`
    display: flex;
    justify-content: end;
    padding: 0.5em;
`

function App() {
    const { setAuthToken } = useWallet()
    const [profile, setProfile] = useState({})

    return (
            <ApolloProvider>
                <ThemeProvider>
                    <GlobalStyle />
                    <Nav>
                        <Wallet setProfile={setProfile} profile={profile}/>
                        <Button onClick="">Logout</Button>
                    </Nav>
                    <Routes>
                        <Route path="/new" element={<Container><NewBoard profile={profile} /></Container>}/>
                        <Route path="/" element={<Container><Home profile={profile} /></Container>}/>
                    </Routes>
                </ThemeProvider>
            </ApolloProvider>
    );
}

export default App;
