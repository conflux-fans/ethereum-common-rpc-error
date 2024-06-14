const { provider, wallet, TARGET_ADDRESS, checkError, wait, chainId } = require('./init');
const { parseEther, parseUnits } = require('ethers');
const _ = require('lodash');

test('wrong chainId', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let txMeta = {
      type: 0,
      to: TARGET_ADDRESS,
      value: 1,
      nonce,
      chainId: 100,
      gasLimit: 21000,
      gasPrice: parseUnits('1', 'gwei'),
    };
    // txMeta = await wallet.populateTransaction(txMeta);
    // txMeta.chainId = 100;
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      await wallet.provider.send('eth_sendRawTransaction', [raw]);
      throw new Error('should not reach here');
    } catch (e) {
      checkError(e, {code: -32000, message: 'invalid sender'}); // why invalid sender?
    }
  });
  //   {
  //     code: -32000,
  //     message: 'invalid chain id, expected: 17000 got: [100 0 0 0]'
  //   }


test('balance not enough', async () => {
    let nonce = await provider.getTransactionCount(wallet.address);
    let txMeta = {
      type: 0,
      to: TARGET_ADDRESS,
      value: parseEther('10'),
      gasLimit: 21000,
      gasPrice: parseUnits('1', 'gwei'),
      chainId,
      nonce,
    };
  
    let raw = await wallet.signTransaction(txMeta);
    try {
      await wallet.provider.send('eth_sendRawTransaction', [raw]);
      throw new Error('should not reach here');
    } catch (e) {
      let error = e.error || e.info.error;
      expect(error.code).toBe(-32000);
      expect(error.message.startsWith('insufficient funds for gas * price + value')).toBeTruthy();
    }
});

/*
{
  code: -32000,
  message: 'insufficient funds for gas * price + value: balance 1000000000000000000, tx cost 10000021000000000000, overshot 9000021000000000000'
}
*/

test('balance not enough 2', async () => {
  let nonce = await provider.getTransactionCount(wallet.address);
  let balance = await provider.getBalance(wallet.address);
  let txMeta = {
    type: 0,
    to: TARGET_ADDRESS,
    value: balance,
    gasLimit: 21000,
    gasPrice: parseUnits('1', 'gwei'),
    chainId,
    nonce,
  };

  let raw = await wallet.signTransaction(txMeta);
  try {
    await wallet.provider.send('eth_sendRawTransaction', [raw]);
  } catch (e) {
    let error = e.error || e.info.error;
    expect(error.code).toBe(-32000);
    expect(error.message.startsWith('insufficient funds for gas * price + value')).toBeTruthy();
  }
});