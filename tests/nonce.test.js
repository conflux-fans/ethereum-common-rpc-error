const { parse } = require('dotenv');
const { provider, wallet, TARGET_ADDRESS, checkError, wait, chainId, parseUnits } = require('./init');
const _ = require('lodash');

test('same nonce', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let random = _.random(1000, 10000);
    let txMeta = {
      type: 0,
      to: TARGET_ADDRESS,
      value: 1,
      nonce: nonce + random,
      // nonce: nonce + 100,
      gasLimit: 21000,
      gasPrice: 1,
      chainId,
    };
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      let res = await wallet.provider.send('eth_sendRawTransaction', [raw]);
      let res1 = await wallet.provider.send('eth_sendRawTransaction', [raw]);
      throw new Error('should not reach here');
    } catch (e) {
        checkError(e, {code: -32000, message: 'already known'});
    }
});

test('same nonce 2', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let random = _.random(1000, 10000);
    nonce = nonce + random;

    let txMeta = {
      type: 0,
      to: TARGET_ADDRESS,
      value: 1000,
      nonce: nonce + random,
      gasLimit: 21000,
      gasPrice: parseUnits('1', 'gwei'),
      chainId,
    };

    try {
      let raw = await wallet.signTransaction(txMeta);
      let res = await wallet.provider.send('eth_sendRawTransaction', [raw]);

      txMeta.value = 1;
      raw = await wallet.signTransaction(txMeta);
      let res1 = await wallet.provider.send('eth_sendRawTransaction', [raw]);
      throw new Error('should not reach here');
    } catch (e) {
        checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
    }
});

test('small nonce', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let txMeta = {
    type: 0,
    nonce: nonce - 1,
    gasLimit: 21000,
    gasPrice: 1,
    chainId,
    to: TARGET_ADDRESS,
    value: 1000,
  };

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    throw new Error('should not reach here');
  } catch (e) {
    let error = e.error || e.info.error;
    expect(error.code).toBe(-32000);
    expect(error.message.startsWith('nonce too low')).toBeTruthy();
  }
});
