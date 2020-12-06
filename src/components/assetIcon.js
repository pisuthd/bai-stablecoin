import styled from "styled-components"
import { ReactComponent as DaiIcon} from "../assets/dai-logo.svg"
import { ReactComponent as BaiIcon} from "../assets/bai-logo.svg"


const AssetIcon = styled(
    ({className , symbol }) => {

        let Icon

        switch(symbol) {
            case "dai":
                Icon = DaiIcon
                break
            case "bai":
                Icon = BaiIcon
                break
            default:
                Icon = DaiIcon
        }

        return (
            <div className={className}>
                <Icon className="svg"/>
            </div>
        )
    })`
    
    .svg {
        height: 80px;
        width: 80px;
    }

    `

export default AssetIcon