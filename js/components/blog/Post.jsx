import React, { useEffect } from "react";
import { useParams } from "react-router";
import {getWindowDimensions} from "../Navigation";

function Post() {
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
                <h1 className="mt-5 text-light">Features</h1>
                <h6 className="mb-5 text-secondary">The rundown...</h6>
                <p className="text-primary">
                    Canary Punks mint started on 23rd March, 2022, and quickly sold out all 5,001 tokens!
                    <br/><br/>
                    Holders are rewarded on an ongoing basis, 10% of each mint cost was shared amongst all holders, and
                    now the secondary sales royalties are distributed in a similar manner.
                    <br/><br/>
                    Building upon the success of Canary Punks we recently launched Flare Punks as a free Airdrop on the Flare network for holders of Canary Punks.
                    <br/><br/>
                    Like Canary Punks, Flare Punks also shares the secondary sale royalties amongst current holders.


                </p>
                <p>

                </p>
                <p>

                </p>
            </div>
        </div>
    );
}

export default Post;
