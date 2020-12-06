import styled from "styled-components"
import { Row, Col, Container } from "reactstrap"
import Stats from "./components/stats"
import Actions from "./components/actions"

const MainPanel = styled(
    ({ className }) => {
        return (
            <Container className={className}>
                <Stats/>
                <Actions/>
            </Container>
        )
    })`
    
    padding: 20px;
    padding-top: 40px; 
    `

export default MainPanel