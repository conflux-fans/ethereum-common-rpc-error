# ethereum-common-rpc-error

This is a list of common RPC errors that can be returned by Ethereum nodes. The list is not exhaustive, but it covers the most common errors.

## eth_sendRawTransaction

### nonce

1. too low
2. too high
3. same nonce: already known; underpriced

### gas

1. `out of gas`
2. `intrinsic gas too low`
3. `gas limit exceeded`

### gasPrice

### balance not enough

### chainId

### Misc

1. `invalid sender`
2. rlp error
3. signature error
4. data too large
5. txpool is full ✅
6. already known ✅

### References

1. [Top 10 Ethereum Transaction Errors and How to Prevent Them](https://www.blocknative.com/blog/ethereum-transaction-errors)

## eth_call

Mainly, the call failed due to the following reasons:

1. `out of gas`
2. `invalid opcode`
3. `revert`
4. `stack too deep`
5. `stack underflow`
6. `stack overflow`
7. `bad instruction`
8. `invalid jump`
9. `invalid memory access`
10. `invalid storage access`
11. `out of memory`
12. `internal error`
13. `unknown error`

## eth_estimate
