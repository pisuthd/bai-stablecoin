

import { Jumbotron } from "reactstrap"
import styled from "styled-components"
import IllustrationPNG from '../../assets/illustration-generate-bai.png';

const Main = styled(
    ({ className,  children  }) => {
        return (
            <Jumbotron className={className}>
                
                <img className="bg" src={IllustrationPNG} alt="bg" />
                <div className="content"> 
                    {children}
                </div>
            </Jumbotron>
        )
    })`

    border-radius: 15px;
    border: 0px;
    padding: 20px;
    box-shadow: 0px 0px 25px #ddd;
    min-height: 400px;
    background: white; 
    override: hidden;
    position: relative; 
    overflow: hidden;

    .bg {
        position: absolute;
        bottom: -10px;
        left: -0px;
        z-index: 10;
        width: 100%;
    }
    .content {
        z-index: 100; 

    }

    `


// const Jumbotron = ({ children }) => {
//     return (
//         <J>
//             {children}
//         </J>
//     )
// }

export default Main

