import { createGlobalStyle } from 'styled-components'
import MainPanel from "./Main"
import Navigation from "./Navigation"
import PositionProvider from "./hooks/usePosition"

const GlobalStyle = createGlobalStyle`
 
  &.body {
    height: 100vh;
    background: radial-gradient( #373B44 , #4286f4);
  }

`

function App() {
  return (
    <PositionProvider>
      <GlobalStyle />
      <div className="body">
        <Navigation/>
        <MainPanel />
      </div>
    </PositionProvider>
  );
}

export default App;
