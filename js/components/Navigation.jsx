import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import {useConnectWallet} from "@web3-onboard/react";
import { Container } from "nes-react"
//import punklogo from "../assets/images/punk.png"
import {ToastContainer} from "react-toastify";
import menuImg from "../assets/images/menu.png"
import logo from "../assets/images/cplogo2.png"

function getWindowDimensions() {
    const { innerWidth: width } = window;
    let body = document.body,
        html = document.documentElement;

    let height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    return {
        width,
        height
    };
}

function Navigation() {

    const [menu, sMenu] = useState(false)

    function toggleMenu() {
        menu ? sMenu(false) : sMenu(true)
        //let menuDiv = document.getElementById("menu");
        //menuDiv.focus()

    }



    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    useEffect(()=>{}, [menu])

    return (
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <Container style={{display: "flex", width: "100%"}}>

                    <div style={{ justifyContent: "flex-start"}}>
                    {/*<img style={{ height: "48px", marginRight: "16px", borderRadius: "12px", justifyContent: "flex-start"}} src={punklogo} alt={" "}/>*/}

                    <NavLink style={{ justifyContent: "flex-start"}} className="navbar-brand " to="/">
                        {getWindowDimensions().width > 400 ?
                            <img style={{
                                height: "48px",
                                marginRight: "16px",
                                borderRadius: "12px",
                                justifyContent: "flex-start"
                            }} src={logo} alt={"Canary Punks"}/>
                            :
                            <img style={{
                                height: "32px",
                                marginRight: "16px",
                                borderRadius: "12px",
                                justifyContent: "flex-start"
                            }} src={logo} alt={"Canary Punks"}/>
                        }

                    </NavLink>
                    </div>
                    {getWindowDimensions().width > 1023 ?
                        <div style={{justifyContent: "flex-end", marginLeft: "auto"}}>
                            <ul className="navbar-nav ml-auto">
                                {/*<li className="nav-item">*/}
                                {/*    <NavLink className="nav-link" to="/">*/}
                                {/*        Home*/}
                                {/*        <span className="sr-only">(current)</span>*/}
                                {/*    </NavLink>*/}
                                {/*</li>*/}
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/mint">
                                        Mint
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/rewards">
                                        Rewards
                                    </NavLink>
                                </li>
                                {wallet ?
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/holding">
                                            Holding
                                        </NavLink>
                                    </li>
                                    : null}
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/about">
                                        About
                                    </NavLink>
                                </li>
                                <li className="nav-item">

                                </li>
                            </ul>
                        </div>
                        :
                        <>
                        <div style={{position: "absolute", right: "20px", top: "40px", display: "block"}} onClick={()=>toggleMenu()}>
                            <img style={{height: "1em"}} src={menuImg} alt="Menu"/>
                        </div>
                            {menu ?
                                <div id="menu" style={{
                                    width: "150px",
                                    height: "210px",
                                    position: "absolute",
                                    right: "20px",
                                    top: "65px",
                                    display: "block",
                                    border: "3px solid #333",
                                    borderRadius: "8px",
                                    zIndex: 100,
                                    background: "rgba(32,32,32,0.8)"
                                }}
                                onClick={()=>toggleMenu()}
                                >
                                    <ul className="mobNav ml-auto">
                                        {/*<li className="nav-item">*/}
                                        {/*    <NavLink className="nav-link" to="/">*/}
                                        {/*        Home*/}
                                        {/*        <span className="sr-only">(current)</span>*/}
                                        {/*    </NavLink>*/}
                                        {/*</li>*/}
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/mint">
                                                Mint
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/rewards">
                                                Rewards
                                            </NavLink>
                                        </li>
                                        {wallet ?
                                            <li className="nav-item">
                                                <NavLink className="nav-link" to="/holding">
                                                    Holding<br/>
                                                </NavLink>
                                            </li>
                                            : null}
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/about">
                                                About
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">

                                        </li>
                                    </ul>
                                </div>
                                :
                                null
                            }
                        </>
                    }

                </Container>
            </nav>
        </div>
    );
}

export { Navigation, getWindowDimensions }
