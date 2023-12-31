import React, {useEffect, useState} from "react";

import {ethers} from 'ethers'
//import {w3o} from '../index'
import {useConnectWallet} from '@web3-onboard/react'

import {roCallers, th} from '../abis/netdata'
import ReactTooltip from "react-tooltip";

const NSF = require('../abis/NeoSwapFactory.json');
const EVMTH = require('../abis/EVMCoinHolder.json')
const ERC20 = require('../abis/ERC20.json')
const FSUM = require('../abis/FSUM.json')


const options = {value: "0", gasLimit: "8000000"}

let pclen = []
let vals = []
let chains = []

const Contact = () => {

    // const [output, setop] = useState(0)


    let [state, setState] = useState({})
    let [coinInf, setCi] = useState({})
    let [change, addChange] = useState(0)
    let [targetAddr, sta] = useState();
    let [chainInfo, sci] = useState()
    let [isConnected, sic] = useState(false)
    let [ddvals, sddvals] = useState([])
    let [destChain, setDestChain] = useState();

    let wAddr
    //const wallets = await onboard.connectWallet();

    const [{wallet, connecting}, connect, disconnect] = useConnectWallet()

    let prov
    let wal

    if (wallet?.provider) {
        wal = wallet
        console.log("wal=", wal)
        prov = new ethers.providers.Web3Provider(wal.provider)

        wAddr = wallet.accounts[0].address

        //////sic(true)

        prov.on("network", (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network

            wAddr = wallet.accounts[0].address

            getAllowedCoinsChains().then(() => {

                console.log(newNetwork, oldNetwork)
                //////if (oldNetwork) {
                sci(newNetwork.chainId)
                sic(true)
                //window.location.reload();
                ////// }
                console.log("cco", chainInfo)
            })
        });

        //const [ethersProvider, setProvider] = useState<ethers.providers.Web3Provider | null>()

        window.wal = wal;
    }

    async function updatebal(addr) {
        let bal;
        if (addr.toUpperCase() != "0XFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF") {
            let ERC20C = new ethers.Contract(addr, ERC20, prov.getSigner());
            await ERC20C.deployed();
            console.log("getbalance", addr, wAddr)
            bal = await ERC20C.balanceOf(wAddr);
        } else {
            bal = await prov.getBalance(wAddr);
        }
        let ci = coinInf
        ci["bal"] = ethers.utils.formatEther(bal);
        setCi(ci)
        addChange(change + 1)
    }

    async function handleInputChange(event) {
        const target = event.target;
        state[target.name] = target.value;
        setState(state);
        console.log(target.name)
       if(target.name==="name") {
           console.log(target.value.length, target.value, wAddr)
           if (target.value.length === 42) {
               let cn; let cs; let bal; let origin = null; let origid=null;
               if(target.value.toUpperCase() != "0XFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF") {
                   let ERC20C = new ethers.Contract(target.value, FSUM, prov);
                   await ERC20C.deployed();
                   cn = await ERC20C.name();
                   cs = await ERC20C.symbol()
                   console.log("getbalance", wAddr)
                   bal = await ERC20C.balanceOf(wAddr);
                   try {
                       origin = await ERC20C.origAddress();
                       origid = await ERC20C.origChainID();
                   } catch (e) {
                   }
               } else { // is NAT
                   let thc = new ethers.Contract(th[chainInfo].ctr, EVMTH, roCallers[chainInfo]);
                   await thc.deployed();
                   cn = await thc.NAT_Name();
                   cs = await thc.NAT_Symb();
                   bal = await prov.getBalance(wAddr);
               }
               coinInf["cName"] = cn;
               coinInf["cSymb"] = cs;
               coinInf["bal"] = ethers.utils.formatEther(bal);
               coinInf["cAddr"] = target.value;
               coinInf["origAddr"] = origin;
               coinInf["origChid"] = origid;
               console.log("CICN", coinInf)

               setCi(coinInf)
               sta(await getNewAddr())

               addChange(change + 1)

           }
       }
        if (target.name === "destChain") {
            console.log("tn = destchain")
            if (target.value !== 'moo') {
                sta(await getNewAddr())

            document.getElementById('_destChain').style.border = '0px';
            document.getElementById('_destChain').style.borderRadius = '0px';
        }

    }

    }

    const WrapOrUnWrap = async () => {
        console.log(NSF)
        let destchain = "moo"
        window.signer = await prov.getSigner()
        let signer = window.signer
        //    let EVMTHC = new ethers.Contract(th, EVMTH, signer);
        //   await EVMTHC.deployed();
        /////// console.log("fuckoff", signer)
        ///"0xc7aB3144C2D0B177E5256d8f78397166311bC595"
        const Wrap_Addr = state.name;
        /////////alert("'"+Wrap_Addr+"'")
        console.log(state)
        
        const weiVal = ethers.utils.parseUnits(state.wval, "ether")
        console.log("weival", weiVal)





        let EVMTHC = new ethers.Contract(th[chainInfo].ctr, EVMTH, signer);
        await EVMTHC.deployed();
        let unwrap = false;
        if(coinInf.origChid !== null){ destChain = coinInf.origChid; unwrap = true; } else {
            // get dest chain id from the dropdown
            destChain = state.destChain
        }

        if(!destChain ){
            document.getElementById('_destChain').style.border='5px solid red';
            document.getElementById('_destChain').style.borderRadius='5px';
        } else {
            console.log(targetAddr, state.name);
            if(state.name.toUpperCase() != "0XFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF") {
                let ERC20C = new ethers.Contract(Wrap_Addr, ERC20, signer);
                await ERC20C.deployed();

                let rec = await ERC20C.approve(th[chainInfo].ctr, weiVal, options);
                await rec.wait(1)
                let out
                console.log("wrap/unwrap", unwrap, coinInf)
                if (unwrap === true) {
                    console.log("EVMTHC.ERC20_burn(", coinInf.cAddr, weiVal, options, ")")
                    out = await EVMTHC.ERC20_burn(coinInf.cAddr, weiVal, options)
                } else {
                    console.log("EVMTHC.depositERC20(", Wrap_Addr, weiVal, destChain, options, ")")
                    out = await EVMTHC.depositERC20(Wrap_Addr, weiVal, destChain, options)
                }
                console.log(out)
                let plop
                let receipt = await out.wait(1).catch((err) => {
                    plop = err
                })
                console.log("re.c>", receipt, plop)
                let a = await prov.getTransaction(out.hash);
                console.log("tx", a)
                await prov.call(a, a.blockNumber)
                    .then((res) => {
                        console.log(false, res, "We should never see this!");
                    })
                    .catch((err) => {
                        err.revertMsg = err.error.toString().split("\n")[0].replace("Error: execution reverted: ", "");
                        console.log(false, err, "Revert message from contract:\n" +
                            "\"" + err.revertMsg + "\""
                        );
                    });
                updatebal(coinInf["cAddr"])
            } else {  // deal with wrapping NAT
                let out;
                let opts = options; opts.value = weiVal
                out = await EVMTHC.deposit(destChain, opts);
                console.log(out)
                let plop
                let receipt = await out.wait(1).catch((err) => {
                    plop = err
                })
                console.log("re.c>", receipt, plop)
                let a = await prov.getTransaction(out.hash);
                console.log("tx", a)
                await roCallers[chainInfo].call(a, a.blockNumber)
                    .then((res) => {
                        console.log(false, res, "We should never see this!");
                    })
                    .catch((err) => {
                        err.revertMsg = err.error.toString().split("\n")[0].replace("Error: execution reverted: ", "");
                        console.log(false, err, "Revert message from contract:\n" +
                            "\"" + err.revertMsg + "\""
                        );
                    });
                updatebal(coinInf["cAddr"])
            }
        }
    }


    useEffect(() => {

    }, [change])

    const getNewAddr = async () => {
        console.log("getnewaddr", state.destChain)
        if(isNaN(parseInt(state.destChain))){
            return("Select network");
        } else {
            console.log("sdc", parseInt(state.destChain), th[state.destChain])
            let thc = new ethers.Contract(th[state.destChain].ctr, EVMTH, roCallers[state.destChain]);
            await thc.deployed();
            console.log("inputs", "vW" + coinInf.cSymb, "Wrapped " + coinInf.cName + " (" + chainInfo.toString() + ")", coinInf.cAddr, chainInfo)
            let addr = await thc.ERC20_getAddr("vW" + coinInf.cSymb, "Wrapped " + coinInf.cName + " (" + chainInfo.toString() + ")", coinInf.cAddr, chainInfo);
            console.log("Addr:", addr)
            return addr;
        }
    }

    const getAllowedCoinsChains = async () => {
        if (vals.length === 0 && th[chainInfo]) {
            console.log("th", th[chainInfo], roCallers[chainInfo], chainInfo)
            let thc = new ethers.Contract(th[chainInfo].ctr, EVMTH, roCallers[chainInfo]);
            await thc.deployed();
            pclen = await thc.getPermittedChains()
            chains = []
            try {
                for (let i = 0; i < pclen.length; i++) {
                    chains.push({val: pclen[i].toString(), text: pclen[i] + ": " + th[pclen[i]].name})
                }
            } catch (e) {
                console.log("Err", e)
            }
            let palen = await thc.getPermittedTokens()
            vals = []
            //todo: add created coins to this list
            try {
                for (let i = 0; i < palen.length; i++) {
                    if(palen[i].toUpperCase()=="0XFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"){
                        console.log("oink oink oink")
                        console.log(await thc.NAT_Name(), await thc.NAT_Symb())
                        vals.push({val: palen[i], text: await thc.NAT_Name()})
                    } else {
                        let thd = new ethers.Contract(palen[i], ERC20, roCallers[chainInfo]);
                        await thd.deployed();
                        console.log(await thd.name(), await thd.symbol())
                        vals.push({val: palen[i], text: await thd.name()})
                    }
                }

            } catch (e) {
                console.log("Err", e)
            }
            let createdCoins = await (thc.getAllCreatedTokens())
            console.log(createdCoins)
            try {
                for (let i = 0; i < createdCoins.length; i++) {
                    let thd = new ethers.Contract(createdCoins[i], ERC20, roCallers[chainInfo]);
                    await thd.deployed();
                    console.log(await thd.name(), await thd.symbol())
                    vals.push({val: createdCoins[i], text: await thd.name()})
                }

            } catch (e) {
                console.log("Err", e)
            }
            sddvals(vals)
            console.log("c/a:", palen, pclen, vals)
            //////////return addr;
        }
    }

    return (
        <div className="about h-auto min-vh-100" style={{
            borderRadius: "8px",
            background: "darkgreen",
            border: "4px green solid",
            padding: "16px",
            margin: "4px"
        }}>
            <div className="container">
                <div className="row align-items-top my-5">
                    {isConnected ?
                        <>
                            <div className="col-lg-5" style={{
                                borderRadius: "8px",
                                background: "rgba(64,64,64,0.7)",
                                color: "white",
                                border: "transparent",
                                padding: "16px",
                                margin: "4px"
                            }}>
                                Source network: {chainInfo ? th[chainInfo].name : null}<br/><br/>
                                Select a coin<br/>
                                <select style={{background: "transparent", border: "0px", height: "100px", width: "100%", color: "white"}} name="name"
                                        onChange={handleInputChange} multiple>
                                    {ddvals.length ? vals.map(values =>
                                        <option key={values.val} value={values.val}>{values.text}</option>
                                    ) : "mook"}
                                </select><br/><br/>
                                {/*<input name="name" type="text" value={state.name} onChange={handleInputChange}*/}
                                {/*       onKeyUp={handleInputChange}/><br/>*/}
                                [ Symb: {coinInf.hasOwnProperty('cSymb') ? coinInf.cSymb : null} ,
                                Bal: {coinInf.hasOwnProperty('bal') ? parseFloat(coinInf.bal).toFixed(2) : '?'} ]
                                <button style={{float:"right", border: "1px dotted white", minWidth: "22px", textAlign: "center", borderRadius: "32px", marginRight: "8px"}} onClick={() => updatebal(coinInf.cAddr)}>Update</button>
                                <br/><br/>


                                Amount:<br/>
                                <input style={{background: "rgba(64,64,64,0.7)", border: "0px"}} type="text" name="wval" value={state.wval} onChange={handleInputChange}
                                       onKeyUp={handleInputChange}/><br/>

                            </div>
                            <br/>
                            <div className="col-lg-6" style={{
                                borderRadius: "8px",
                                background: "rgba(64,64,64,0.7)",
                                color: "white",
                                border: "3px rgba(64,64,64,0.1) solid",
                                padding: "16px",
                                margin: "4px"
                            }}>
                                { coinInf.hasOwnProperty('cName') ?  <>
                                {coinInf.hasOwnProperty("cName") && coinInf.origChid === null ?

                                    <> Output: <select name="destChain" id='_destChain' onChange={handleInputChange}>
                                        <option key="moo" value="moo">Select chain</option>
                                        {chains.length ? chains.map(values => <option key={values.val}
                                                                                      value={values.val}>{values.text}</option>) : "mook"}
                                        <br/>
                                    </select> <br/><br/>
                                        Token Name:
                                        Wrapped {coinInf.hasOwnProperty('cName') ? coinInf.cName : '?'} ({chainInfo})<br/>
                                        Token Symb: vW{coinInf.hasOwnProperty('cSymb') ? coinInf.cSymb : '?'}<br/>
                                        Token Addr: <span data-tip  data-for="registerTip">{targetAddr ? targetAddr.substring(0, 6) + "..." + targetAddr.substring(38, 42) : null}</span>

                                        <ReactTooltip clickable={true} delayHide={3000} id="registerTip" place="top"
                                                      effect="solid">
                                            {targetAddr ? targetAddr : null}
                                        </ReactTooltip><br/>
                                        Amount: {state.wval}<br/><br/>
                                        <div style={{position: "absolute", bottom: "32px", right: "32px"}}>
                                        <button style={{float:"left", border: "1px dotted white", minWidth: "22px", textAlign: "center", borderRadius: "32px", marginRight: "8px"}} onClick={() => WrapOrUnWrap()}>Wrap
                                        </button>
                                        <div style={{ float:"right", border: "1px dotted white", minWidth: "22px", textAlign: "center", borderRadius: "32px"}} data-tip data-for="wrapTip">?</div>
                                        <ReactTooltip clickable={true} delayHide={3000} id="wrapTip" place="left" effect="solid">
                                            This will wrap the selected coin and make it available for you to<br/>
                                            use as a wrapped currency on your chosen destination network.<br/><br/>
                                            Note that a 1% fee applies to wrap / unwrap transactions<br/>
                                            to cover our operational costs
                                        </ReactTooltip>
                                        </div>
                                    </>

                                    :

                                    <> Output: {coinInf.origChid? coinInf.origChid.toString() + ": " + th[parseInt(coinInf.origChid.toString())].name : null}
                                        <br/><br/>

                                        Token Name: {coinInf.hasOwnProperty('cName') ? coinInf.cName : '?'}<br/>
                                        Token Symb: {coinInf.hasOwnProperty('cSymb') ? coinInf.cSymb : '?'}<br/>
                                        Token Addr: <span data-tip data-for="registerTip">{targetAddr ? coinInf.origAddr.substring(0, 6) + "..." + coinInf.origAddr.substring(38, 42) : null}</span><br/>
                                        Orig Addr: <span data-tip  data-for="origAddrTip">{targetAddr ? coinInf.cAddr.substring(0, 6) + "..." + coinInf.cAddr.substring(38, 42) : null}</span>
                                        <ReactTooltip clickable={true} delayHide={3000} id="registerTip" place="top" effect="solid">
                                            This is the address for the original token:<br/><br/>
                                            <span onClick={() => addTokenToWallet("ERC20", { address: coinInf.origAddr, symbol: coinInf.cSymb, decimals: 18, image: 'https://foo.io/token-image.svg'})} style={{textDecoration: "underline"}}>
                                                {coinInf.origAddr ? coinInf.origAddr : null}
                                            </span>

                                        </ReactTooltip>
                                        <ReactTooltip clickable={true} delayHide={3000} id="origAddrTip" place="top" effect="solid">
                                            This is the address for the wrapped token:<br/><br/>
                                            <span onClick={() => addTokenToWallet("ERC20", { address: coinInf.cAddr, symbol: coinInf.cSymb, decimals: 18, image: 'https://foo.io/token-image.svg'})} style={{textDecoration: "underline"}}>
                                                {coinInf.cAddr ? coinInf.cAddr : null}
                                            </span>
                                        </ReactTooltip>
                                        <br/>
                                        Amount: {state.wval}<br/><br/>
                                        <div style={{position: "absolute", bottom: "32px", right: "32px"}}>
                                        <button style={{float:"left", border: "1px dotted white", minWidth: "22px", textAlign: "center", borderRadius: "32px", marginRight: "8px"}} onClick={() => WrapOrUnWrap()}>Unwrap</button>
                                            <div style={{ float:"right", border: "1px dotted white", minWidth: "22px", textAlign: "center", borderRadius: "32px"}} data-tip data-for="unwrapTip">?</div>
                                        <ReactTooltip clickable={true} delayHide={6000} id="unwrapTip" place="left" effect="solid">
                                            This will unwrap the selected coin and convert it back<br/>
                                            into it's original currency on the chain you wrapped it on.<br/><br/>
                                            Note that a 1% fee applies to wrap / unwrap transactions<br/>
                                            to cover our operational costs
                                        </ReactTooltip>
                                        </div>
                                    </>

                                } </>
                                    : "Select a coin first" }

                            </div>
                        </>
                        :
                        <div className="col-lg-8">
                            Please connect to a wallet first<br/><br/>

                        </div>
                    }
                    {/*<div className="col-lg-10">
                        <h1 className="font-weight-light">Factory State Vars</h1>
                        <p>

                        </p>
                        <div style={{border: "1px solid black", borderRadius: "8px", padding: "8px"}}>
                            <p>Settings<br/>
                                Set default FTSO delegations:<br/>
                                Addr 1 <input style={{maxWidth:"30%"}} name="aa"/>
                                Percent <input style={{width:"50px"}} name="pc"/>
                                Addr 2 <input style={{maxWidth:"30%"}} name="bb"/> <span/><br/><br/>
                                Set LP Fees:<br/>
                                Percent <input style={{width:"50px"}} name="pc"/>
                                Send to <input style={{maxWidth:"30%"}} name="bb"/> <span/><br/>
                            </p>
                        </div>
                    </div>*/}
                </div>
            </div>
        </div>
    );
}

const addTokenToWallet = async ( type, options ) => {


    let req = {
        method: 'wallet_watchAsset',
        params: {
            type: type,
            options: { options },
        },
    }

    console.log(req)

    window.ethereum
        .request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: options.address,
                    symbol: options.symbol,
                    decimals: 18,
                    image: 'https://foo.io/token-image.svg',
                },
            },
        })
        .then((success) => {
            if (success) {
                console.log('FOO successfully added to wallet!');
            } else {
                throw new Error('Something went wrong.');
            }
        })
        .catch(console.error);

    //
    // const args = { params: { type: type, options: options }}
    // console.log(window.ethereum)
    // await window.ethereum.request({ method: 'wallet_watchAsset', args })
    //     .then(() => {
    //         console.log( 'Success, Token added!')
    //     })
    //     .catch((error) => {
    //         console.log(`Error: ${error.message}`)
    //     })
}

export default Contact;
