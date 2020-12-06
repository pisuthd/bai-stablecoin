import styled from "styled-components"
import { Row, Col, Container, Card, Form, FormGroup, Label, Input, Button, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import AssetIcon from "../components/assetIcon"


// const ACTIONS = {
//     MINT: "Mint tokens",
//     DEPOSIT: "Add collateral",
//     WITHDRAW: "Withdraw collateral",
//     REPAY: "Repay"
// }

const Actions = styled(
    ({ className }) => {



        return (
            <Row className={className}>
                <Col xs="12">
                    <Card>
                        <Row>
                            <Col xs="4">
                                    <AssetIcon symbol="dai" />
                                    <InputGroup>
                                        <Input />
                                        <InputGroupAddon addonType="append">
                                            <InputGroupText>DAI</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <p>Max: 1234</p>
                            </Col>
                            <Col xs="4" style={{paddingTop: 35}}>

                                <Button color="success" block>Mint</Button>
                                <Button color="warning" block>Unlock</Button>


                                {/* <FormGroup>
                                    
                                    <Input type="select" name="selectMulti" id="exampleSelectMulti">
                                        { Object.keys(ACTIONS).map( (item, index) => {
                                            return (
                                                <option value={item} key={index}>{ACTIONS[item]}</option>
                                            )
                                        })}
                                    </Input>
                                </FormGroup> */}
                            </Col>
                            <Col xs="4">
                                <AssetIcon symbol="bai" />
                                <InputGroup>
                                    <Input />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>BAI</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <p>Collateralization Ratio: 1234</p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        )
    })`
    
    margin-top: 30px;

    

    .card {
        padding: 20px;
        padding-top: 30px;
        padding-bottom: 30px; 
        text-align: center;
    }
    
    .panel {
        display: flex;
        flex-direction: column;
    }

    .input-group {
        margin-top: 20px;
    }

    p {
        font-weight: 600;
        font-size: 12px;
        
        margin-top: 5px;
    }
    

    `

export default Actions