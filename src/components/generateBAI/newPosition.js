


import Jumbotron from "./jumbotron"
import styled from "styled-components"
import { Row, Col as C } from "reactstrap"
import SendSVG from "../../assets/send-icon.svg"


const Filler = styled.img`
   margin: auto;
`

const Col = styled(C)`
    display: flex;
`

const NewPosition = () => {
    return (
        <Jumbotron>
            <Row style={{ paddingTop: 30 }}>
                <Col xs="5">
                    LEFT
                </Col>
                <Col xs="2">
                    <Filler src={SendSVG} />
                </Col>

                <Col xs="5">
                    RIGHT
                </Col>
            </Row>
        </Jumbotron>
    )
}

export default NewPosition