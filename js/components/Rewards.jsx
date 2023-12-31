//import {XummSdk} from "xumm-sdk"

import React, {useEffect, useState} from "react";
import {StarField} from "../star";
import {getWindowDimensions} from "./Navigation";
import {toast} from "react-toastify";
import {useConnectWallet} from "@web3-onboard/react";
import {Button, Container} from "nes-react"
import {ethers} from "ethers";


function Rewards() {

    const [pic, setPic] = useState(process.env.PUBLIC_URL + '/cpunks/images/'+Math.floor(Math.random()*5000)+'.png');

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
    let options = { gasLimit: 8000000, value: 0 }
    let sgbContract = "0xe6e7dB32df87F75609fB78D5f52753C2d3D98d84"
    let flrContract = "0xc5F0C8b27dd920F4F469a857D6F0fEcF0fA2bDb8"



    const [{wallet, connecting}, connect, disconnect] = useConnectWallet()

    useEffect(() => {
        let sfCanvas = document.getElementById("star_field")
        sfCanvas.height = getWindowDimensions().height.toString();
        sfCanvas.width = getWindowDimensions().width.toString();
        //toast(JSON.stringify(getWindowDimensions()))
        let sf = new StarField(sfCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
    }, [])

    async function claimFlr() {
        let prov = new ethers.providers.Web3Provider(wallet.provider)
        let ctrfClaim = new ethers.Contract(flrContract, abi, prov.getSigner())

        if(parseInt(wallet?.chains[0]?.id, 16) !== 14) {
            toast.info("You are connected via Songbird, attempting to change chains")
            await prov.send("wallet_switchEthereumChain", [{chainId: "0xe"}])
        }

        await ctrfClaim.claimRewards(wallet?.accounts[0]?.address, options)
            .then(r => {
                try {
                    r.wait(1);
                    toast.success("Transaction Successful")
                } catch (e) {
                    toast.error("Error: " + e.code.message);
                }
            })
            .catch(e => {
                try {
                    console.log("em", e.message)
                    toast.error("Error: " + e.message.toString().split("(")[0]);
                } catch (f) {
                    console.log(f)
                    toast.error("Transaction failed");
                }
                console.log(e);
            })
    }

    async function claimSgb() {
        let prov = new ethers.providers.Web3Provider(wallet.provider)
        let ctrsClaim = new ethers.Contract(sgbContract, abi, prov.getSigner())
        if(parseInt(wallet?.chains[0]?.id, 16) !== 19) {
            toast.info("You are connected via Flare, attempting to change chains")
            await prov.send("wallet_switchEthereumChain", [{chainId: 19}])
        }

        await ctrsClaim.claimRewards(wallet?.accounts[0]?.address, options)
            .then(r => {
                try {
                    r.wait(1);
                    toast.success("Transaction Successful")
                } catch (e) {
                    toast.error("Error: " + e.code.message);
                }
            })
            .catch(e => {
                try {
                    console.log("em", e.message)
                    toast.error("Error: " + e.message.toString().split("(")[0]);
                } catch (f) {
                    console.log(f)
                    toast.error("Transaction failed");
                }
                console.log(e);
            })

    }

    return (<>
            <div className="home vh-100">
                <canvas id="star_field" style={{
                    top: 0,
                    left: 0,
                    zIndex: "-1",
                    position: "absolute",
                    backgroundColor: "#060713"
                }}></canvas>
                <div className="container vh-100">

                    <div className="row align-items-top my-5">
                        <div className="col-lg-3">
                            <img
                                className="img-fluid rounded mb-4 mb-lg-0"
                                src={pic}
                                alt=""
                            />
                        </div>
                        <div className="col-lg-9">
                            <h1 className="font-weight-light text-light">Rewards</h1>
                            <p className="text-light">
                                If you hold Canary Punks or Flare punks, you are rewarded a portion of the royalties for
                                every future sale.<br/>
                                <br/>
                                Holders of Flare Punks are also rewarded in FTSO earnings, as all royalties recieved are
                                automatically delegated to FTSOs.<br/><br/>
                                Claiming your rewards couldn't be simpler - connect your wallet and we will check
                                your rewards for you automatically; if any are due, just click on the "Claim Now" link
                                in
                                the popup {wallet ? <>or use the buttons below (only visible if you have rewards
                                due)<br/><br/>
                                {window.hasOwnProperty("claimFlare") ?
                                    <Button onClick={()=>claimFlr()}
                                            style={{
                                        background: "#00aeef",
                                        color: "white"
                                    }}>Claim {window.claimFlare.toFixed(2)} FLR</Button> : null}
                                {window.hasOwnProperty("claimsgb") ?
                                    <Button onClick={()=>claimSgb()}
                                            style={{
                                        background: "#00aeef",
                                        color: "white"
                                    }}>Claim {window.claimsgb.toFixed(2)} SGB</Button> : null}
                            </> : null}
                                <br/><br/><br/>
                                <br/><br/><br/>
                                <br/><br/><br/>

                            </p>
                        </div>

                    </div>
                    <div style={{height: "300px"}}></div>
                </div>
            </div>
        </>
    );
}

export default Rewards;
