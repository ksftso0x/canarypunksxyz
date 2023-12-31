import React, {useEffect} from "react";

import { globalStateContext } from '../index'
import {useConnectWallet} from "@web3-onboard/react";
import { Button, Container } from "nes-react"
import { toast } from "react-toastify"
import { ethers } from "ethers"

let suppressFetch = false;
console.log("SFI", suppressFetch)

function Footer() {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    let { text } = React.useContext(globalStateContext);



    useEffect(()=> {

    }, [text])

    useEffect(()=>{
        if(!wallet){
            toast.warn("Connect your wallet first!")
        } else {
            if(suppressFetch === false){
                toast.success("Your wallet is connected!")
                console.log("SF", suppressFetch)
                checkReward()
            }

        }
    }, [wallet])

    async function checkReward(){
        suppressFetch = true;
        let options = { gasLimit: 8000000, value: 0 }
        let prov = new ethers.providers.Web3Provider(wallet.provider)
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
        let ri = await ctr.getRewardsAmount(wallet.accounts[0].address)
        //alert(JSON.stringify(ri))
        let pdf = parseFloat(ethers.utils.formatEther(ri.toString(10)))
        if(pdf > 0) {
            window.claimsgb = pdf;
            toast.success(<>
                    <div style={{cursor: "default"}}>You are eligible for a reward
                        of {pdf.toFixed(2)}
                        {" "}SGB
                        {" "}from this collection!<br/>
                        <div
                            style={{textDecoration: "underline", cursor: "pointer"}}
                            onClick={
                                async () => {
                                    suppressFetch = true;
                                    if(parseInt(wallet?.chains[0]?.id, 16) !== 19) {
                                        toast.info("You are connected via Flare, attempting to change chains")
                                        await prov.send("wallet_switchEthereumChain", [{chainId: 19}])
                                    }

                                    prov = new ethers.providers.Web3Provider(wallet.provider)
                                    let ctrsClaim = new ethers.Contract(sgbContract, abi, prov.getSigner())

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

                                }}>
                            Click to claim
                        </div>
                    </div>
                </>,
                {
                    autoClose: 30000,

                })
        }




        let ctrf = new ethers.Contract(flrContract, abi, flrProv)
        let rif = await ctrf.getRewardsAmount(wallet.accounts[0].address)

        //console.log("AR EYE", ri);
        let pdff = parseFloat(ethers.utils.formatEther(rif.toString()))
        //alert(JSON.stringify(pdff))
        if(pdff > 0) {
            window.claimFlare = pdff;
            toast.success(<>
                    <div style={{cursor: "default"}}>You are eligible for a reward
                        of {pdff.toFixed(2)}
                        {" "}FLR
                        {" "}from Flare Punks!<br/>
                        <div
                            style={{textDecoration: "underline", cursor: "pointer"}}
                            onClick={
                                async () => {

                                    if(parseInt(wallet?.chains[0]?.id, 16) !== 14) {
                                        toast.info("You are connected via Songbird, attempting to change chains")
                                        await prov.send("wallet_switchEthereumChain", [{chainId: "0xe"}])
                                            // .then(async () => {
                                            //     prov = new ethers.providers.Web3Provider(wallet.provider)
                                            //     let ctrfClaim = new ethers.Contract(flrContract, abi, prov.getSigner())
                                            //
                                            //     await ctrfClaim.claimRewards(wallet?.accounts[0]?.address, options);
                                            //
                                            // });
                                    }

                                        prov = new ethers.providers.Web3Provider(wallet.provider)
                                        let ctrfClaim = new ethers.Contract(flrContract, abi, prov.getSigner())

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






                                }}>
                            Click to claim
                        </div>
                    </div>
                </>,
                {
                    autoClose: 30000,

                })
        }

        if(pdf === 0.0 && pdff === 0.0){
            toast.info("You are not eligible for any rewards from Canry Punks or Flare Punks at this time, please try again later.", {autoClose: 30000})
        }

    }

    return (
        <div style={{zIndex: 0}} className="py-2 bg-dark fixed-bottom h-auto">
            <footer className="py-2 bg-dark">
                <div className="container">
                    <p className="m-0 text-center text-white">
                        Wallet: {text.substring(0,6)}...{text.substring(38,42)}
                        <Button
                            disabled={connecting}
                            onClick={() => {
                                wallet ? suppressFetch=true : suppressFetch=false;
                               // console.log("SFEE", suppressFetch);

                                    (wallet ? disconnect({label: wallet.label}) : connect());

                            }}
                        >
                            {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
                        </Button>
                    </p>
                    <p className="m-0 text-center text-white">
                        &copy; Canary Punks, _jp '23
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
