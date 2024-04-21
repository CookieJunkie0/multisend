const ethers = require("ethers");
require("dotenv").config({ path: "./.env" });
const { DISPERSE_ABI } = require("./abi.js");
const fs = require('fs');

const RPC = process.env.RPC;
const CONTRACT = process.env.CONTRACT;
const AMOUNT = JSON.parse(process.env.AMOUNT);
const MAIN_WALLET = process.env.MAIN_WALLET;

function getRandomInt(min, max) { 
    return Number((Math.random() * (max - min) + min).toFixed(8));
}

function getAmounts(wallets) {
    if(typeof(AMOUNT) == "object") {
        const amounts = new Array(wallets.length).fill("").map(() => getRandomInt(AMOUNT[0], AMOUNT[1]));
        return {total: ethers.utils.parseEther(`${amounts.reduce((a, b) => a+b)}`), amounts: amounts.map(x => ethers.utils.parseEther(`${x}`))}
    }
    return {total: ethers.utils.parseEther(`${AMOUNT*wallets.length}`), amounts: new Array(wallets.length).fill(ethers.utils.parseEther(`${AMOUNT}`))};
}

async function main() {
    const wallets = fs.readFileSync('wallets.txt', 'utf8').toString().split('\n').map(x => x.replace(/(\r\n|\n|\r)/gm, ""));
    console.log(`Made by - https://t.me/cookiejunkieeth\nMade by - https://t.me/cookiejunkieeth\nMade by - https://t.me/cookiejunkieeth\n\nDispersing Ether to ${wallets.length} wallets...`);
    const amounts = getAmounts(wallets);

    const provider = new ethers.providers.JsonRpcProvider(RPC);
    const wallet = new ethers.Wallet(MAIN_WALLET, provider);
    const contract = new ethers.Contract(CONTRACT, DISPERSE_ABI, wallet);

    const tx = await contract.disperseEther(wallets, amounts.amounts, {value: amounts.total});

    const receipt = await tx.wait();
    if(receipt.status !== 1) {console.log(`Transaction failed - ${receipt.transactionHash}`);}

    console.log(`Transaction success - ${receipt.transactionHash}`);
}

main()
