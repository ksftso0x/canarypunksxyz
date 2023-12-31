//import {XummSdk} from "xumm-sdk"

import React, {useEffect, useState} from "react";
import {StarField} from "../star";
import {useConnectWallet} from "@web3-onboard/react";
import {TextInput, Button} from "nes-react"
import {ethers} from "ethers";
import {toast} from "react-toastify";

function Admin() {

    const [{wallet, connecting}, connect, disconnect] = useConnectWallet()

    const [isAdmin, sIA] = useState(false);

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
        'function adminList(address) view returns(bool)',
        'function totalSupply() view returns(uint256 _ts)',
        'function freeMintNFT(uint256, address, uint256[])'
    ]
    let sgbContract = "0xe6e7dB32df87F75609fB78D5f52753C2d3D98d84"
    let flrContract = "0xc5F0C8b27dd920F4F469a857D6F0fEcF0fA2bDb8"
    let options = { gasLimit: 8000000, value: 0 }
    let flrProv = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/flrhttp")
    let roFctr = new ethers.Contract(flrContract, abi, flrProv)
    let ad = roFctr.adminList(wallet?.accounts[0]?.address.toString())
        .then(r => {
            sIA(r)
        })

    async function FreeMint(){

        let prov = new ethers.providers.Web3Provider(wallet.provider)
        let flrContract = "0xc5F0C8b27dd920F4F469a857D6F0fEcF0fA2bDb8"
        let ctrfClaim = new ethers.Contract(flrContract, abi, prov.getSigner())
        let mamt = document.getElementById("bbb").value
        let addr = document.getElementById("aaa").value
        toast("Trying to mint "+mamt+" tokens for "+addr)
        await ctrfClaim.freeMintNFT(mamt, addr, [], options);
    }

    useEffect(() => {
        let sf = new StarField(document.getElementById("star_field"), 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 100);
        //setIA()
    }, [])

    async function setIA(){
        //sIA((await roFctr.adminList(wallet?.accounts[0]?.address.toString())))
    }

    useEffect(() => {}, [isAdmin])

    return (<>
        <div className="home vh-100">
            <canvas id="star_field" className="vw-100 vw-100" width="512px" height="512px"
                    style={{top: 0, left: 0, zIndex: "-1", position: "absolute", backgroundColor: "#060713"}}></canvas>
            <div className="container vh-100">
                {wallet ? <> {console.log(wallet?.accounts[0]?.address.toString(), "0x74664cA92690C1EaD5382808dE0de4B04a2E57Ae")}
                { isAdmin ? <>

                    <div className="row align-items-center my-5">
                        <div className="col-lg-3">
                        </div>
                        <div className="col-lg-9">
                            <h1 className="font-weight-light text-light">Admin</h1>
                            <p className="text-primary">
                                Free Mint Flare Punks<br/>
                                <br/>
                                Address <TextInput id="aaa"/><br/>
                                # Of Tokens <TextInput id="bbb"/><br/>
                                <Button onClick={()=>FreeMint()}
                                        style={{
                                            background: "#00aeef",
                                            color: "white"
                                        }}>Send It</Button>

                            </p>
                        </div>
                    </div>
</> : <><div className="container vh-100">

                    <div className="row align-items-center my-5">
                        <div className="col-lg-3">
                            <img
                                className="img-fluid rounded mb-4 mb-lg-0"
                                src="http://placehold.it/900x400"
                                alt=""
                            />
                        </div>
                        <div className="col-lg-9">
                            <h1 className="font-weight-light text-light">Access denied, mofo!</h1></div></div></div></> }
                </> : null }
                    </div>


                </div>
                    </>
                    );
                }

                export default Admin;
