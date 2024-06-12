const { provider, wallet, TARGET_ADDRESS, checkError, wait, parseEther } = require('./init');
const _ = require('lodash');

test('wrong chainId', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let txMeta = {
      to: TARGET_ADDRESS,
      value: 1000,
      nonce,
    };
    txMeta = await wallet.populateTransaction(txMeta);
    txMeta.chainId = 100;
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      await wallet.provider.send('eth_sendRawTransaction', [raw]);
    } catch (e) {
      checkError(e, {code: -32000, message: 'invalid sender'});
    }
  });
  //   {
  //     code: -32000,
  //     message: 'invalid chain id, expected: 17000 got: [100 0 0 0]'
  //   }


test('balance not enough', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let txMeta = {
      to: TARGET_ADDRESS,
      value: parseEther(10),
      nonce,
    };
    txMeta = await wallet.populateTransaction(txMeta);
    txMeta.chainId = 100;
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      await wallet.provider.send('eth_sendRawTransaction', [raw]);
    } catch (e) {
      checkError(e, {code: -32000, message: 'invalid sender'});
    }
});