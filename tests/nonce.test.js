const { provider, wallet, TARGET_ADDRESS, checkError, wait } = require('./init');
const _ = require('lodash');

test('big nonce', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let random = _.random(1000, 10000);
    let txMeta = {
      to: TARGET_ADDRESS,
      value: 1000,
      nonce: nonce + random,
        // nonce: nonce + 100,
    };
    txMeta = await wallet.populateTransaction(txMeta);
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      let res = await wallet.provider.send('eth_sendRawTransaction', [raw]);
      let res1 = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    } catch (e) {
        checkError(e, {code: -32000, message: 'already known'});
    }
});

  //  { "code": -32000, "message": "failed with 50000000 gas: insufficient funds for gas * price + value: address 0x3D69D968e3673e188B2D2d42b6a385686186258f have 0 want 1000" }

  test('big nonce 2', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let random = _.random(1000, 10000);
    let txMeta = {
      to: TARGET_ADDRESS,
      value: 1000,
      nonce: nonce + random,
        // nonce: nonce + 100,
    };
    txMeta = await wallet.populateTransaction(txMeta);
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      let res = await wallet.provider.send('eth_sendRawTransaction', [raw]);
      await wait(5000);
      let res1 = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    } catch (e) {
        checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
    }
});

test('small nonce', async () => {
  let txMeta = {
    to: TARGET_ADDRESS,
    value: 1000,
  };
  txMeta = await wallet.populateTransaction(txMeta);

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    while(true) {
      let res = await wallet.provider.getTransactionReceipt(hash);
      if (res) {
        break;
      }
      await wait(2000);
    }
    let res1 = await wallet.provider.send('eth_sendRawTransaction', [raw]);
  } catch (e) {
      checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
  }
});
