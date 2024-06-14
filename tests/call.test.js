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
    let res = await provider.call(txMeta);
    throw new Error('should not reach here');
  } catch (e) {
    let error = e.error || e.info.error;
    // console.log(error);
    expect(error.code).toBe(-32000);
    expect(error.message.startsWith('err: insufficient funds for gas * price + value:')).toBeTruthy();
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
        let res = await provider.call(txMeta);
      throw new Error('should not reach here');
    } catch (e) {
      let error = e.error || e.info.error;
    //   console.log(error);
      expect(error.code).toBe(-32000);
      expect(error.message.startsWith('err: max fee per gas less than block base fee')).toBeTruthy();
    }
});

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
        let res = await provider.call(txMeta);
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
        let res = await provider.call(txMeta);
      throw new Error('should not reach here');
    } catch (e) {
      checkError(e, {code: -32000, message: "both gasPrice and (maxFeePerGas or maxPriorityFeePerGas) specified"})
    }
});


// 0x43E04C3D393C9F7C3bEA58d171Bc69260f5519Df

test('require failed call', async () => {
  let txMeta = {
    to: '0x43E04C3D393C9F7C3bEA58d171Bc69260f5519Df',
    data: '0xcd16ecbf0000000000000000000000000000000000000000000000000000000000000005'
  };

  try {
      let res = await provider.call(txMeta);
    throw new Error('should not reach here');
  } catch (e) {
    let expected = {
      code: 3, 
      message: "execution reverted: input must be greater than 10", 
      data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d696e707574206d7573742062652067726561746572207468616e203130000000'
    };
    checkError(e, expected)
  }
});

test('revert call', async () => {
  let txMeta = {
    to: '0x43E04C3D393C9F7C3bEA58d171Bc69260f5519Df',
    data: '0x209877670000000000000000000000000000000000000000000000000000000000000005'
  };

  try {
      let res = await provider.call(txMeta);
    throw new Error('should not reach here');
  } catch (e) {
    let expected = {
      code: 3, 
      message: "execution reverted: Input must be greater than 10", 
      data: '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d496e707574206d7573742062652067726561746572207468616e203130000000'
    };
    checkError(e, expected)
  }
});

// error InsufficientBalance(uint balance, uint withdrawAmount);
test('custom error call', async () => {
  let txMeta = {
    to: '0x43E04C3D393C9F7C3bEA58d171Bc69260f5519Df',
    data: '0x75f7286c0000000000000000000000000000000000000000000000000000000000000005'
  };

  try {
      let res = await provider.call(txMeta);
    throw new Error('should not reach here');
  } catch (e) {
    let expect = {
      code: 3, 
      message: "execution reverted", 
      data: '0xcf47918100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005'
    }
    checkError(e, expect);
  }
});
