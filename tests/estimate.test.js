const { parseUnits } = require('ethers');
const { provider, wallet, TARGET_ADDRESS, checkError } = require('./init');
const _ = require('lodash');

/**
 * 
 * estimate logic
 * 
 * 1. nonce, gasLimit is not check
 */

test('balance not enough', async () => {
  let balance = await provider.getBalance(wallet.address);
  let txMeta = {
    type: 0,
    from: wallet.address,
    to: TARGET_ADDRESS,
    value: balance + 1n,
  };

  try {
    let res = await provider.estimateGas(txMeta);
    throw new Error('should not reach here');
  } catch (e) {
    let error = e.error || e.info.error;
    expect(error.code).toBe(-32000);
    expect(error.message.startsWith('failed with 30000000 gas: insufficient funds for gas * price + value')).toBeTruthy();
  }
});

test('balance not enough2', async () => {
    let balance = await provider.getBalance(wallet.address);
    let txMeta = {
      type: 0,
      from: wallet.address,
      to: TARGET_ADDRESS,
      value: balance,
      gasPrice: 1,
    };
  
    try {
      let res = await provider.estimateGas(txMeta);
      throw new Error('should not reach here');
    } catch (e) {
      let error = e.error || e.info.error;
      expect(error.code).toBe(-32000);
      expect(error.message.startsWith('insufficient funds for transfer')).toBeTruthy();
    }
  });

test('gas price too low', async () => {
    let txMeta = {
      type: 0,
      from: wallet.address,
      to: TARGET_ADDRESS,
      value: 1,
      gasPrice: 1,
    };

    try {
    //   let res = await wallet.estimateGas(txMeta);
        let res = await provider.estimateGas(txMeta);
    //   let res = await wallet.provider.send('eth_estimateGas', [txMeta]);
      throw new Error('should not reach here');
    } catch (e) {
      let error = e.error || e.info.error;
    //   console.log(error);
      expect(error.code).toBe(-32000);
      expect(error.message.startsWith('failed with 30000000 gas: max fee per gas less than block base fee')).toBeTruthy();
    }
});

/**
    {
      code: -32000,
      message: 'failed with 30000000 gas: max fee per gas less than block base fee: address 0x0000000000000000000000000000000000000000, maxFeePerGas: 1, baseFee: 955893245'
    }
*/

test('chainId mismatch', async () => {
    let txMeta = {
      type: 0,
      from: wallet.address,
      to: TARGET_ADDRESS,
      value: 1,
      gasPrice: 1,
      chainId: 10,
    };

    try {
        let res = await provider.estimateGas(txMeta);
      throw new Error('should not reach here');
    } catch (e) {
      checkError(e, {code: -32000, message: "chainId does not match node's (have=10, want=17000)"})
    }
});

test('two kind gasPrice', async () => {
    let txMeta = {
      type: 0,
      from: wallet.address,
      to: TARGET_ADDRESS,
      value: 1,
      gasPrice: 1,
      maxPriorityFeePerGas: 1,
      maxFeePerGas: 1,
    };

    try {
        let res = await provider.estimateGas(txMeta);
      throw new Error('should not reach here');
    } catch (e) {
      checkError(e, {code: -32000, message: "both gasPrice and (maxFeePerGas or maxPriorityFeePerGas) specified"})
    }
});


/*
    传参类型错误
    {
      code: -32602,
      message: 'invalid argument 0: json: cannot unmarshal non-string into Go struct field TransactionArgs.value of type *hexutil.Big'
    }
*/