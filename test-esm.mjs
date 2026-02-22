import assert from 'assert';
import RavencoinKey from './dist/module.mjs';

assert.ok(RavencoinKey, "RavencoinKey should be defined");
assert.strictEqual(typeof RavencoinKey.generateAddress, "function", "generateAddress should be a function");
assert.strictEqual(typeof RavencoinKey.getAddressByWIF, "function", "getAddressByWIF should be a function");

const result = RavencoinKey.generateAddressObject();
assert.ok(result.mnemonic, "Should generate mnemonic");
assert.strictEqual(result.network, "rvn", "Default network should be rvn");

console.log("ES module import and execution successful!");
