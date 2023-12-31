import {XummSdk} from "xumm-sdk"

import React, {useEffect, useState} from "react";
import {StarField} from "../star";
import {getWindowDimensions} from "./Navigation";

import discord from '../assets/images/discord.png'
import twitter from '../assets/images/twitter.png'
import {Button} from "nes-react"



function Mint() {

    const item = "0";

    const [pic, setPic] = useState(process.env.PUBLIC_URL + '/cpunks/images/'+Math.floor(Math.random()*5000)+'.png');



    useEffect(()=>{

        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
        //toast(JSON.stringify(getWindowDimensions()))
        let sf = new StarField(sfCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
        let timer = setInterval(()=>{choosePic()}, 5000);
        return () => {
            clearInterval(timer)
        }
    }, [])

    function choosePic(){
        let cc = Math.floor(Math.random()*2)
        let picTmp;
        if(cc >0 ) {
            picTmp = process.env.PUBLIC_URL + '/cpunks/images/' + Math.floor(Math.random() * 5000) + '.png'
        } else {
            picTmp = process.env.PUBLIC_URL + '/fpunks/images/' + Math.floor(Math.random() * 1000) + '.png'
        }
        setPic(picTmp);
        window.pic = picTmp
        console.log(picTmp)

    }

    useEffect(()=>{}, [pic])

    async function openPage(url){
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (<>
            <div className="home vh-100">
                <canvas id="star_field" className="vw-100 vw-100" width="512px" height="512px" style={{top:0, left: 0, zIndex: "-1", position: "absolute", backgroundColor: "#060713"}} ></canvas>
            <div className="container vh-100">

                <div className="row align-items-center my-5">
                    <div
                         className="col-lg-7">
                        <img style={{width: "90%", borderRadius: "16px", border: "0px solid black"}}
                            id="img123" className="img-fluid mb-4 mb-lg-0"
                            src={pic}
                            alt="-"
                        />
                    </div>
                    <div className="col-lg-5">
                        <h1 className="font-weight-light text-light">Mint</h1>
                        <p className="text-light">
                            You missed it! Following a highly successful mint of the original Canary Punks,
                            we recently airdropped 1,000 Flare Punks to holders of the original collection
                            on SGB. To check out what's happening with new releases, hit us up on
                            <Button onClick={()=>openPage("https://discord.gg/8cdPB9M3e8")} className="nes-btn is-error">
                                <img style={{marginRight: "4px", position: "relative", top: "-3px", height:"1.1em"}} src={discord} alt="discordlogo"/>Discord </Button> or{" "}
                            <Button onClick={()=>openPage("https://twitter.com/Canary_Punks")} className="nes-btn is-error"><img style={{marginRight: "4px", position: "relative", top: "-3px", height:"1.1em"}} src={twitter} alt="twitterlogo"/>Twitter</Button>
                        </p>
                    </div>

                </div>
                <div style={{height: "500px"}}> </div>
            </div>
        </div>
        </>
    );
}

export default Mint;
