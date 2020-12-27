import { useState } from "react"
import { createGlobalStyle } from 'styled-components'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from "ethers";
// import MainPanel from "./Main"
import Navigation from "./Navigation"
// import ContractsProvider from "./hooks/useContracts"
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";

import Home from "./routes/home"
import GenerateBAI from "./routes/generateBAI"
import Stake from "./routes/stake"
import Swap from "./routes/swap"

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const GlobalStyle = createGlobalStyle`
 
  ${ props => props.showBackground && `
  &.body {
    height: 100vh;
    background: radial-gradient( #373B44 , #4286f4);
  }
  `}

  &.body {
    height: 100vh;
    background: #f8f9fa;
  }

`

function App() {

  // const [showBackground, setBackground] = useState(false)

  return (
    <Web3ReactProvider getLibrary={getLibrary} >
      <GlobalStyle />
      <div className="body">
        <Router>
          <Navigation />
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/generateBAI">
              <GenerateBAI />
            </Route>
            <Route path="/stake">
              <Stake />
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Redirect to="/home" />
          </Switch>
        </Router>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
