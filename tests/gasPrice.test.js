const { provider, wallet, TARGET_ADDRESS, checkError, wait, chainId } = require('./init');
const _ = require('lodash');

/* test('small gas price', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let txMeta = {
    type: 0,
    to: TARGET_ADDRESS,
    value: 10,
    gasLimit: 21000,
    gasPrice: 0,
    chainId,
    nonce: nonce + 11,
  };
  // console.log(txMeta);
  // txMeta = await wallet.populateTransaction(txMeta);

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    throw new Error('should not reach here');
  } catch (e) {
      checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
  }
}); */