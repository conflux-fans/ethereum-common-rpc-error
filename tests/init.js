const { JsonRpcProvider, Wallet, parseUnits } = require('ethers');
require('dotenv').config();

const { URL, PRIVATE_KEY, CHAIN_ID } = process.env;

const provider = new JsonRpcProvider(URL);

const wallet = new Wallet(PRIVATE_KEY, provider);

module.exports = { 
    provider, 
    wallet,
    TARGET_ADDRESS: '0x7deFad05B632Ba2CeF7EA20731021657e20a7596',
    checkError,
    wait,
    chainId: CHAIN_ID,
    parseUnits
};

function checkError(e, expected) {
    // if is other error, will encounter can't read property 'error' of undefined
    expect(e.error || e.info.error).toStrictEqual(expected)
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}