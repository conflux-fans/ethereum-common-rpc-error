const { provider, wallet, TARGET_ADDRESS, checkError, wait } = require('./init');
const _ = require('lodash');

test('small gas price', async () => {
  let txMeta = {
    to: TARGET_ADDRESS,
    value: 10,
    gas: 1,
    gasPrice: 1,
  };
  txMeta = await wallet.populateTransaction(txMeta);

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
  } catch (e) {
      checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
  }
});