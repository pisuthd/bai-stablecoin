import { useContext } from "react"
import styled from "styled-components"
import { Row, Col, Container, Card, CardTitle, CardSubtitle, CardText } from "reactstrap"
import { ContractsContext } from "../hooks/useContracts"


const Stats = styled(
    ({ className }) => {

        const { baiPositionManager  } = useContext(ContractsContext)

        return (
            <Row className={className}>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">{baiPositionManager.totalCollateralAmount} DAI</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Total Collateral</CardSubtitle>
                        
                    </Card>
                </Col>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">{baiPositionManager.collateralizationRatio} %</CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">Min. Collateralization Ratio</CardSubtitle>
                        
                    </Card>
                </Col>
                <Col xs="4">
                    <Card>
                        <CardTitle tag="h5">{baiPositionManager.totalTokensOutstanding} BAI</CardTitle>
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