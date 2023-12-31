import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {StarField} from "../../star";
import {getWindowDimensions} from "../Navigation";

function Blog() {
    useEffect(() => {
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
        //toast(JSON.stringify(getWindowDimensions()))
        let sf = new StarField(sfCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
    }, [])
    return (
        <>
            <canvas id="star_field" className="vw-100 vw-100" width="512px" height="512px"
                    style={{top: 0, left: 0, zIndex: "-1", position: "absolute", backgroundColor: "#060713"}}></canvas>
            <div className="home">
                <div className="home vh-100">

                    <div className="container vh-100">
                        <div className="container">
                            <h1 className="text-center text-light mt-5">About Canary Punks</h1>
                            <Outlet/>
                        </div>
                        <div style={{height: "250px"}}></div>
                    </div>
                </div>
            </div>
                </>
                );
                }

                export default Blog;
