const { parseUnits } = require('ethers');
const { provider, wallet, TARGET_ADDRESS, checkError, wait, chainId } = require('./init');
const _ = require('lodash');

test('small gas', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let txMeta = {
    type: 0,
    to: TARGET_ADDRESS,
    nonce,
    value: 10,
    gasLimit: 1,
    chainId,
  };

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    throw new Error('should not reach here');
  } catch (e) {
      checkError(e, {code: -32000, message: 'intrinsic gas too low: gas 1, minimum needed 21000'});
  }
});

test('big gas', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let txMeta = {
    type: 0,
    to: TARGET_ADDRESS,
    value: 10,
    gasPrice: parseUnits('1', 'gwei'),
    gasLimit: 300000000,
    nonce,
    chainId,
  };

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    throw new Error('should not reach here');
  } catch (e) {
    // console.log(e.error || e.info.error);
    checkError(e, {code: -32000, message: 'exceeds block gas limit'});
  }
});

test('tx fee cap', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let txMeta = {
    type: 0,
    to: TARGET_ADDRESS,
    value: 10,
    gasPrice: parseUnits('1000', 'gwei'),
    gasLimit: 30000000,
    nonce,
    chainId,
  };

  let raw = await wallet.signTransaction(txMeta);
  try {
    let hash = await wallet.provider.send('eth_sendRawTransaction', [raw]);
    throw new Error('should not reach here');
  } catch (e) {
    checkError(e, {code: -32000, message: 'tx fee (30.00 ether) exceeds the configured cap (1.00 ether)'});
  }
});
