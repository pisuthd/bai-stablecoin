

export const shortAddress = (address) => {
    return `${address.slice(0,7)}...${address.slice(-5)}`
}