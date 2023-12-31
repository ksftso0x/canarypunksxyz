import React, { useEffect } from "react";
import { useParams } from "react-router";
import {getWindowDimensions} from "../Navigation";

function Team() {
    let { postSlug } = useParams();

    useEffect(() => {
        // Fetch post using the postSlug
    }, [postSlug]);

    useEffect(()=>{
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
    }, [])

    return (
        <div className="home">
            <div className="container">
                <h1 className="mt-5 text-light">The Team</h1>
                <h6 className="mb-5 text-secondary">This project was made possible by these amazing people:</h6>
                <p className="text-primary">
                    <span className="text-light">TrapJk</span><br/>Founder
                    <br/><br/>
                    <span className="text-light">_JP</span><br/>Lead developer, contracts, frontend.
                    <br/><br/>
                    <span className="text-light">SF90</span><br/>Developer, contracts
                    <br/><br/>
                    <span className="text-light">Dazza</span><br/>Lead Artist
                    <br/><br/>
                    <span className="text-light">Hodlers</span><br/>Goes without saying, none of this would be possible without all of our loyal fans!

                </p>
                <p>

                </p>
                <p>

                </p>
            </div>
        </div>
    );
}

export default Team;
