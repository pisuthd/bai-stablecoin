

export const shortAddress = (address) => {
    return `${address.slice(0,7)}...${address.slice(-5)}`
}

export const calculateCollateralizationRatio = (collateralAmount, issuingAmount) => {
    const issuingAmountInBaseCurrency = issuingAmount / 30
    return (collateralAmount / issuingAmountInBaseCurrency) * 100
}