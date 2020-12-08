import { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Row, Col, Container, Card, Form, FormGroup, Label, Input, Button, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import AssetIcon from "../components/assetIcon"
import { ContractsContext } from "../hooks/useContracts"
import { calculateCollateralizationRatio } from "../utils"

// const ACTIONS = {
//     MINT: "Mint tokens",
//     DEPOSIT: "Add collateral",
//     WITHDRAW: "Withdraw collateral",
//     REPAY: "Repay"
// }


const Actions = styled(
    ({ className }) => {

        const { daiERC20, account, baiPositionManager } = useContext(ContractsContext)
        const [collateralAmount, setCollateralAmount] = useState(0)
        const [issuingAmount, setIssuingAmount] = useState(0)
        const [collateralizationRatio, setCollateralizationRatio] = useState(0)

        const handleChange = (e) => {
            if (e.target.id === "collateralAmount") {
                setCollateralAmount(e.target.value)
            } 
            if (e.target.id === "issuingAmount") {
                setIssuingAmount(e.target.value)
            } 
        }

        useEffect(() => {

            if (collateralAmount > 0 && issuingAmount > 0) {
                const ratio = calculateCollateralizationRatio(collateralAmount, issuingAmount)
                setCollateralizationRatio(ratio)
            }

        },[collateralAmount, issuingAmount])

        return (
            <Row className={className}>
                <Col xs="12">
                    <Card>
                        <Row>
                            <Col xs="4">
                                <AssetIcon symbol="dai" />
                                <InputGroup>
                                    <Input disabled={!account} id="collateralAmount" onChange={handleChange} value={collateralAmount} />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>DAI</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <p>Balance: {daiERC20.balance} DAI</p>
                            </Col>
                            <Col xs="4" style={{ paddingTop: 35 }}>
                                <Button color="success" onClick={() => { baiPositionManager.mint(collateralAmount, issuingAmount) }} block>Mint</Button>
                                <Button onClick={() => { daiERC20.approve() }} color="warning" block>Unlock</Button>
                            </Col>
                            <Col xs="4">
                                <AssetIcon symbol="bai" />
                                <InputGroup>
                                    <Input  disabled={!account} id="issuingAmount" onChange={handleChange} value={issuingAmount} />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>BAI</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <p>Collateralization Ratio: {collateralizationRatio.toLocaleString()}%</p>
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