
import { Container } from "reactstrap"
import ManagePosition from "../components/generateBAI/managePosition"
import NewPosition from "../components/generateBAI/newPosition"

const GenerateBAI = () => {
    return (
        <Container style={{paddingTop : "3rem"}}>
            <NewPosition />

        </Container>
    )
}

export default GenerateBAI