
import styled from "styled-components"
// import { Button } from "reactstrap"

export const ConnectButton = styled(
    ({ className, icon, onConnect, children }) => {
        return (
            <div className={className}>
                <button onClick={onConnect} className="btn">
                    <img src={icon} alt="icon" className="svg" />
                    <div>
                        {children}
                    </div>
                    
                </button>
            </div>)
    })`

    .btn {
        border-radius: 32px;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        font-weight: 600;
        display: flex;
        flex-direction: row; 
        color: grey;
        box-shadow: 0 0 6px 0 rgba(157, 96, 212, 0.5);
        border: solid 3px transparent;
        background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #78e4ff, #ff48fa);
        background-origin: border-box;
        background-clip: content-box, border-box;
        box-shadow: 2px 1000px 1px #fff inset;
        .svg {
            width: 24px;
            height: 24px;
            margin-right: 5px;  
        }
        :hover {
            box-shadow: none;
            color: white;
            cursor: pointer;
            .svg {
                filter: invert(99%) sepia(0%) saturate(0%) hue-rotate(223deg) brightness(114%) contrast(101%);
            }
        }
    }


    

    `