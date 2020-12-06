import { createGlobalStyle } from 'styled-components'
import MainPanel from "./Main"
import Navigation from "./Navigation"

const GlobalStyle = createGlobalStyle`
 
  &.body {
    height: 100vh;
    background: radial-gradient( #373B44 , #4286f4);
  }

`

function App() {
  return (
    <>
      <GlobalStyle />
      <div className="body">
        <Navigation/>
        <MainPanel />
      </div>
    </>
  );
}

export default App;
