import {ethers} from 'ethers'

const roCallers = [];
roCallers[19] = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/http");
roCallers[16] = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/testhttp");
roCallers[14] = new ethers.providers.JsonRpcProvider("https://rpc.viri.uk/flrhttp");
roCallers[56] = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
roCallers[97] = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
roCallers[43113] = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");

const cdata = [];
cdata[19] = { name: "Songbird", nat: "SGB" };
cdata[16] = { name: "Coston", nat: "CFLR" };
cdata[14] = { name: "Flare", nat: "FLR" };
cdata[56] = { name: "Binance SC", nat: "BNB" };
cdata[97] = { name: "Binance SC Test", nat: "BNBT" };
cdata[43113] = { name: "Avax Fuji Test", nat: "AVAXT" };

const th = [];
th[14] = { ctr: "", name: "Flare", nat: "FLR" };
th[16] = {
    ctr: "0x82A41be16715846D870c3024bE29973a9920435D",
    name: "Coston",
    nat: "CFLR",
};
th[19] = {
    ctr: "0x3cA1Bd0a00A4b7785441E5926d38C7eA4870Edcb",
    name: "Songbird",
    nat: "SGB",
};
th[56] = { ctr: "", name: "Binance SC", nat: "BNB" };
th[97] = {
    ctr: "0xb08fb43442BB36b1686e38ca692a1cf9F7069e71",
    name: "Binance SC Test",
    nat: "BNB",
};
th[43113] = {
    ctr: "0xb08fb43442BB36b1686e38ca692a1cf9F7069e71",
    name: "Avax Fuiji Test",
    nat: "AVAXT",
};

export { th, cdata, roCallers };
