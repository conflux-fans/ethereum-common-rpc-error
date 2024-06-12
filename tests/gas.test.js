const { provider, wallet, TARGET_ADDRESS, checkError, wait } = require('./init');
const _ = require('lodash');

test('small gas', async () => {
  let txMeta = {
    to: TARGET_ADDRESS,
    value: 10,
    gas: 1,
  };
  txMeta = await wallet.populateTransaction(txMeta);

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
  } catch (e) {
      checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
  }
});

test('big gas', async () => {
  let txMeta = {
    to: TARGET_ADDRESS,
    value: 10,
    gas: 30000000,
  };
  txMeta = await wallet.populateTransaction(txMeta);

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
  } catch (e) {
    checkError(e, {code: -32000, message: 'replacement transaction underpriced'});
  }
});
