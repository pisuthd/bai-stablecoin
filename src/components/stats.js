import styled from "styled-components"
import { Row, Col, Container, Card, CardTitle, CardSubtitle, CardText } from "reactstrap"

const Stats = styled(
    ({ className }) => {
        return (
            <Row className={className}>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">400 DAI</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Total Collateral</CardSubtitle>
                        
                    </Card>
                </Col>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">105%</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Min. Collateralization Ratio</CardSubtitle>
                        
                    </Card>
                </Col>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">100 BAI</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Tokens Outstanding</CardSubtitle>
                       
                    </Card>
                </Col>
            </Row>
        )
    })`
    
    .card {
        padding: 20px;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: center;
        
    }

    `

export default Stats