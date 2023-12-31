//import {XummSdk} from "xumm-sdk"

import React, {useEffect, useState} from "react";
import {StarField} from "../star";
import {useConnectWallet} from "@web3-onboard/react";
import {ethers} from "ethers";
import {getWindowDimensions} from "./Navigation";



function Holding() {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [cpnk, setcpnk] = useState("0")
    const [fpnk, setfpnk] = useState("0")
    const [fpnks, setFP] = useState([]);
    const [cpnks, setCP] = useState([])
    const [upd, supd] = useState(0);
    const [attribs, sa] = useState([])

    const [images] = useState([])

    const [pic, setPic] = useState("")

    const bob = []

    let options = { gasLimit: 8000000, value: 0 }
    //let prov = new ethers.providers.Web3Provider(wallet.provider)
    let flrProv = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/flrhttp")
    let sgbProv = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/http")
    //await prov.send("wallet_switchEthereumChain", [{chainId: "0x" + parseInt(chainData[dat.network].chainId).toString(16)}]);
    //console.log(prov)
    const abi = [
        'function tokenOfOwnerByIndex(address, uint256) view returns(uint256)',
        'function balanceOf(address) view returns(uint256)',
        'function COOLDOWN_TIME() view returns(uint256)',
        'function MINT_PRICE() view returns(uint256)',
        'function _MINT_PRICE() view returns(uint256)',
        'function mintNFT(uint256) payable returns(uint256)',
        'function MAX_SUPPLY() view returns(uint256)',
        'function getRewardsAmount(address) view returns (uint256 _amount)',
        'function claimRewards(address)',
        'function totalSupply() view returns(uint256 _ts)'
    ]
    let sgbContract = "0xe6e7dB32df87F75609fB78D5f52753C2d3D98d84"
    let flrContract = "0xc5F0C8b27dd920F4F469a857D6F0fEcF0fA2bDb8"
    let ctr = new ethers.Contract(sgbContract, abi, sgbProv)
    let ctrf = new ethers.Contract(flrContract, abi, flrProv)

    async function getData() {
        let cpnkCount = await ctr.balanceOf(wallet?.accounts[0].address)
        let fpnkCount = await ctrf.balanceOf(wallet?.accounts[0].address)
        setcpnk(cpnkCount.toString());
        setfpnk(fpnkCount.toString());
        getTokens(cpnkCount, fpnkCount)
    }

    async function getTokens(cpc, fpc) {
        let tmp = [];
        let regex = ""
        for(let i = 0; i< cpc; i++){
            let item = (await ctr.tokenOfOwnerByIndex(wallet?.accounts[0].address, i)).toString();
            tmp.push(item)
            if(i< (cpc -1)){
                regex+=item.toString()+"|"
            } else {
                regex+=item.toString()
            }
        }
        //console.log(new RegExp("/("+regex+").(png|jpe?g|svg)$/"))
        //const images = importAll(require.context('../assets/images/cpunks/images', false, new RegExp("/("+regex+").(png|jpe?g|svg)$/")));
        setCP(tmp)
        supd(Math.random())
        tmp = [];
        regex = ""
        for(let i = 0; i< fpc; i++){
            let item = (await ctrf.tokenOfOwnerByIndex(wallet?.accounts[0].address, i)).toString();

            tmp.push(item)

        }
        let re = new RegExp("("+regex+").(png|jpe?g|svg)")
        //const images = importAll(require.context('../assets/images/cpunks/images', false, re));
        setFP(tmp)
    }

    // const loadImage = imageName => {
    //     import(`../assets/images/cpunks/images/${imageName}.png`).then(image => {
    //         images.push(image)
    //     });
    // };

    useEffect(()=>{}, [upd, wallet])

    useEffect(()=>{
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
        //toast(JSON.stringify(getWindowDimensions()))
        let sf = new StarField(sfCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
        getData()
    }, [])

    function genAttribs(){
        return(null)
    }

    useEffect(()=>{
        console.log(pic)
        let js = pic.replace('images', 'json').replace("/app/punks/", "").replace('.png', '.json')
        console.log(js)
        let b = Math.floor(Math.random()*1000)
        let path = "fpunks/json/"+b+".json"
        try {
            let x = require("../json/" + js)
            //console.log("x:", x, js)
            let tmp = []
            x?.attributes?.forEach(att => {
//            console.log(att)
                let a1=att.trait_type;
                tmp.push({ tn: a1, va: att.value});

                //tmp += a1 + ":" + att.value + <br/>
            })

            console.log(tmp)
            sa(tmp)
        } catch (e) {
console.log("errir:", e)
        }

    }, [pic])

    useEffect(()=>{

        console.log("Attrip", attribs)

    }, [attribs])

    function importAll(r) {
        const images = {};
        r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
        return images
    }



    return (<>
            <div className="home vh-100">
                <canvas id="star_field" className="vw-100 vw-100" width="512px" height="512px" style={{
                    top: 0,
                    left: 0,
                    zIndex: "-1",
                    position: "absolute",
                    backgroundColor: "#060713"
                }}></canvas>
                <div className="container vh-100">

                    {wallet ?
                    <div className="row align-items-top my-5">
                        <div style={{lineHeight: "0.5em"}} className="col-lg-3">
                            <img
                                className="img-fluid rounded mb-4 mb-lg-0"
                                src={pic}
                                alt=""
                            />

                            { attribs.map((item, key) => (
                                <><span style={{fontSize: "0.5em"}} className="text-primary text-small">{item.tn}{console.log("aa", item)}</span><br/>
                                    <div style={{textAlign: "right", fontSize: "0.5em"}} className="text-secondary text-small">{item.va}</div><br/></>
                            ) ) }
                        </div>
                        <div className="col-lg-9">
                            <h1 className="font-weight-light text-light">Holding</h1>
                            <p className="text-primary">
                                Your wallet currently contains {cpnk} Canary Punks and {fpnk} Flare Punks<br/>
                                <br/>

                                {/*{JSON.stringify(cpnks)}*/}
                                {/*{JSON.stringify(fpnks)}*/}
                                <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", flexBasis: "90%"}}>
                                    {cpnks.map((item, key) => (
                                            <div
                                                onClick={()=>setPic(process.env.PUBLIC_URL + '/cpunks/images/'+item+'.png')}
                                                key={key} style={{lineHeight: "0.7em", textAlign: "center",border: "2px solid white", borderRadius: "8px", margin: "2px", minWidth: 0}}>
                                                <img style={{border: "2px solid white", borderRadius: "8px", height:"128px", margin: "-2px"}} src={process.env.PUBLIC_URL + '/cpunks/images/'+item+'.png'} alt="123" /><br/>
                                                <span style={{fontSize: "0.6em"}}>Canary Punks<br/>#{item}</span>
                                            </div>
                                        )
                                    )}
                                {fpnks.map((item, key) => (
                                    <div
                                        onClick={()=>setPic(process.env.PUBLIC_URL + '/fpunks/images/'+item+'.png')}
                                        key={key} style={{lineHeight: "0.7em", textAlign: "center",border: "2px solid white", borderRadius: "8px", margin: "2px", minWidth: 0}}>
                                        <img style={{border: "2px solid white", borderRadius: "8px", height:"128px", margin: "-2px"}} src={process.env.PUBLIC_URL + '/fpunks/images/'+item+'.png'} alt="123" /><br/>
                                        <span style={{fontSize: "0.6em"}}>Flare Punks<br/>#{item}</span>
                                    </div>
                                    )
                                    )}
                            </div>

                            </p>
                        </div>
                    </div>
                        :
                        <div className="row align-items-center my-5">
                        <div className="col-lg-9">
                            <h1 className="font-weight-light text-light">Connect Wallet First</h1>
                        </div>
                        </div>
                    }

                </div>
                <div style={{height:"500px"}}> </div>
            </div>

        </>
    );
}

export default Holding;
