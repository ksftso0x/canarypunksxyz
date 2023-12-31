import {XummSdk} from "xumm-sdk"

import React, {useEffect} from "react";
import {Star, StarField} from "../star";
import {getWindowDimensions} from "./Navigation";




function Home() {
    useEffect(()=>{
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
        //toast(JSON.stringify(getWindowDimensions()))
        let sf = new StarField(sfCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
    }, [])
    return (<>
            <div className="home vh-100">
                <canvas id="star_field" className="vw-100 vw-100" width="512px" height="512px" style={{top:0, left: 0, zIndex: "-1", position: "absolute", backgroundColor: "#060713"}} ></canvas>
            <div className="container vh-100">

                <div className="row align-items-center my-5">
                    <div className="col-lg-7">
                        <img
                            className="img-fluid rounded mb-4 mb-lg-0"
                            src="http://placehold.it/900x400"
                            alt=""
                        />
                    </div>
                    <div className="col-lg-5">
                        <h1 className="font-weight-light text-light">Home</h1>
                        <p className="text-light">
                            Lorem Ipsum is simply dummy text of the printing and typesetting
                            industry. Lorem Ipsum has been the industry's standard dummy text
                            ever since the 1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen book.
                        </p>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default Home;
