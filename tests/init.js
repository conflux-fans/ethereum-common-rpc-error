const { JsonRpcProvider, Wallet } = require('ethers');
require('dotenv').config();

const { URL, PRIVATE_KEY } = process.env;

const provider = new JsonRpcProvider(URL);

const wallet = new Wallet(PRIVATE_KEY, provider);

module.exports = { 
    provider, 
    wallet,
    TARGET_ADDRESS: '0x7deFad05B632Ba2CeF7EA20731021657e20a7596',
    checkError,
    wait
};

function checkError(e, expected) {
    if (e.error) {
        console.log('error', e.error);
        expect(e.error).toStrictEqual(expected);
    } 
    if (e.info.error) {
        console.log('info.error', e.info.error);
        expect(e.info.error).toStrictEqual(expected);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}