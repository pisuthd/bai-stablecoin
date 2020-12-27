import { useState } from "react"
import { createGlobalStyle } from 'styled-components'
import MainPanel from "./Main"
import Navigation from "./Navigation"
import ContractsProvider from "./hooks/useContracts"
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Link,
  Route
} from "react-router-dom";

import Home from "./routes/home"
import GenerateBAI from "./routes/generateBAI"
import Stake from "./routes/stake"
import Swap from "./routes/swap"

const GlobalStyle = createGlobalStyle`
 
  ${ props => props.showBackground && `
  &.body {
    height: 100vh;
    background: radial-gradient( #373B44 , #4286f4);
  }
  `}

`

function App() {

  const [showBackground, setBackground] = useState(false)

  return (
    <ContractsProvider>
      <GlobalStyle showBackground={showBackground} />
      <div className="body">
        <Router>
          <Navigation

          />
         
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
            <Redirect to="/home"/>
          </Switch>
        </Router>
      </div>
    </ContractsProvider>
  );
}

export default App;
