import React from "react";
import "./index.css";
import { Web3OnboardProvider, init } from '@web3-onboard/react'
// import walletLinkModule from "@web3-onboard/walletlink";
import walletConnectModule from '@web3-onboard/walletconnect'
import injectedModule from '@web3-onboard/injected-wallets'
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
    Navigation,
    Footer,
    Home,
    Rewards,
    Contact,
    Holding,
    Blog,
    Posts,
    Post, Team, Admin,
    Mint
} from "./components";
import Buffer from "buffer"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

window.Buffer = window.Buffer || Buffer;


const injected = injectedModule()

let chainids = [19, 14, 16]

const walletConnect = walletConnectModule({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
    },
    connectFirstChainId: true
})

export const w3o = init({
    wallets: [injected, walletConnect],
    chains: [
        {
            id: '0x'+(chainids[0].toString(16)),
            token: 'SGB',
            label: 'Songbird',
            rpcUrl: 'https:/rpc.sgbftso.com/http'
        },
        {
            id: '0x'+(chainids[1].toString(16)),
            token: 'FLR',
            label: 'FLR Mainnet',
            rpcUrl: 'https:/rpc.sgbftso.com/http'
        },
        {
            id: '0x'+(chainids[1].toString(16)),
            token: 'CFLR',
            label: 'Coston Local',
            rpcUrl: 'https:/rpc.sgbftso.com/testhttp'
        }
    ],
    notify: {
        desktop: {
            enabled: true,
            transactionHandler: transaction => {
                console.log({ transaction })
                if (transaction.eventCode === 'txPool') {
                    return {
                        type: 'success',
                        message: 'Your transaction from #1 DApp is in the mempool',
                    }
                }
            },
            position: 'bottomRight'
        },
        mobile: {
            enabled: true,
            transactionHandler: transaction => {
                console.log({ transaction })
                if (transaction.eventCode === 'txPool') {
                    return {
                        type: 'success',
                        message: 'Your transaction from #1 DApp is in the mempool',
                    }
                }
            },
            position: 'bottomRight'
        }
    },
    accountCenter: {
        desktop: {
            position: 'bottomRight',
            enabled: true,
            minimal: true
        },
        mobile: {
            position: 'bottomRight',
            enabled: true,
            minimal: true
        }
    },

})




const container = document.getElementById('root');

// Create a root.
const root = createRoot(container);

let globalState = { text: "Not Connected"}

let globalStateContext = React.createContext(globalState);

const App = () => {
    root.render(
        <Web3OnboardProvider web3Onboard={w3o}>
            <ToastContainer/>
        <Router>
            <Navigation/>
            <Routes>

                <Route path="/" element={<Mint/>}/>
                <Route path="/mint" element={<Mint/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/rewards" element={<Rewards/>}/>
                <Route path="/holding" element={<Holding/>}/>
                <Route path="/about" element={<Blog/>}>

                    <Route path="" element={<Posts/>}/>
                    <Route path=":postSlug" element={<Post/>}/>
                    <Route path="/about/team" element={<Team/>}/>
                </Route>

                <Route path="*" element={<Mint/>}/>

            </Routes>
            <Footer/>
        </Router>
        </Web3OnboardProvider>)


    if (window.ethereum) {
        window.ethereum.request({method: 'eth_requestAccounts'})
            .then(res => {
                // Return the address of the wallet
                //let { text } = React.useContext(globalStateContext);
                globalState.text = res[0]
                globalStateContext = React.createContext(globalState);
                console.log(res)
            })
    } else {


    }


}

App();

// function wc(){
//     const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
//
// }

export { globalStateContext }

////////serviceWorker.unregister();
