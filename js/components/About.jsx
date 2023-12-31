import React, {useEffect, useState} from "react";


import { ethers } from 'ethers'

const NSF = require('../abis/NeoSwapFactory.json');
let _output = "aaaa"

let tmp=[]


const About = () => {

   const [output, setop] = useState(0)

    const getFactoryInfo = async () => {
       console.log(NSF)

        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        let NSFC = new ethers.Contract("0xA08db6fe8D16067E3a85073cADFf5e4660ce8200", NSF, signer);
        await NSFC.deployed();
        console.log("fuckoff")

        tmp[0]=await NSFC.PROX_CODE_HASH();
        tmp[1]=await NSFC.owner();
        tmp[2]=await NSFC.feeTo();
        tmp[3]=await NSFC.feeToSetter();
        tmp[4]=await NSFC.LP_IMPLEMENTATION();
        tmp[5]=await NSFC.NET_PROXYADMIN();
        tmp[6]=await NSFC.allPairsLength();
        tmp[6] = tmp[6].toString()
        let moo = await NSFC.ftsoData();
        console.log(moo)
        tmp[7] = moo;
        setop(output+1)

    }

    useEffect(()=>{

    }, [output])

    return (
        <div className="about vh-100 d-flex flex-column">
            <div className="container vh-100 d-flex flex-column">
                <div className="row align-items-center my-5">
                    <div className="col-lg-2">
                        <button onClick={()=>getFactoryInfo()}>Get Fac Info</button>
                    </div>
                    <div className="col-lg-10">
                        <h1 className="font-weight-light">Factory State Vars</h1>
                        <p>
                            PROX CODE HASH {tmp[0]}<br/>
                            OWNER {tmp[1]}<br/>
                            Fee To {tmp[2]}<br/>
                            Fee To Setter {tmp[3]}<br/>
                            LP DEF Impl {tmp[4]}<br/>
                            LP ProxyAdmin {tmp[5]}<br/>
                            # of pairs {tmp[6]}<br/>
                            {tmp[7] && tmp[7].hasOwnProperty('ftso1') ? <>
                            FTSO 1: {tmp[7].ftso1} Percent: {tmp[7].f1prc.toString()}<br/>
                            FTSO 2: {tmp[7].ftso2} Percent: {(100-tmp[7].f1prc).toString()}<br/>
                            </> : null }
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
