import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import {getWindowDimensions} from "../Navigation";

function Posts() {

    useEffect(()=>{
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
    }, [])

    return (
        <div className="home">
            <div className="container">

                    <div className="row align-items-center my-5">
                        <div className="col-lg-7">
                            <img
                                className="img-fluid rounded mb-4 mb-lg-0"
                                src="http://placehold.it/900x400"
                                alt=""
                            />
                        </div>
                        <div className="col-lg-5">
                            <h1 className="font-weight-light"><Link to="/about/features">Features</Link></h1>
                            {/*<p>*/}
                            {/*    Lorem Ipsum is simply dummy text of the printing and typesetting*/}
                            {/*    industry. Lorem Ipsum has been the industry's standard dummy*/}
                            {/*    text ever since the 1500s, when an unknown printer took a galley*/}
                            {/*    of type and scrambled it to make a type specimen book.*/}
                            {/*</p>*/}

                            <br/>
                            <h1 className="font-weight-light"><Link to="/about/team">The Team</Link></h1>
                            {/*<p>*/}
                            {/*    Lorem Ipsum is simply dummy text of the printing and typesetting*/}
                            {/*    industry. Lorem Ipsum has been the industry's standard dummy*/}
                            {/*    text ever since the 1500s, when an unknown printer took a galley*/}
                            {/*    of type and scrambled it to make a type specimen book.*/}
                            {/*</p>*/}
                        </div>
                    </div>

            </div>
        </div>
    );
}

export default Posts;
