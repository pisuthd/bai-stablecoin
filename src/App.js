import { createGlobalStyle } from 'styled-components'
import MainPanel from "./Main"
import Navigation from "./Navigation"
import ContractsProvider from "./hooks/useContracts"

const GlobalStyle = createGlobalStyle`
 
  &.body {
    height: 100vh;
    background: radial-gradient( #373B44 , #4286f4);
  }

`

function App() {
  return (
    <ContractsProvider>
      <GlobalStyle />
      <div className="body">
        <Navigation/>
        <MainPanel />
      </div>
    </ContractsProvider>
  );
}

export default App;
