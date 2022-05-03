# Setup

- Setup Node.js stuff, make sure your node version is compatible (v16 works for sure).
- Have Ethereum Addresses; store private keys as enviornment variables (DO NOT SAVE THEM ON DISK), store Alchemy API as env variable, update `hardhat.config.js`

# Use

- Run `npx hardhat run test/tests.js` for local tests.

- Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy. Save the address and monitor on mumbai.polygonscan.com.

- Run `npx hardhat console --network mumbai` to connect to the network. 
    - Run `.load api.js` to load the api.
        - `api_setup(string contract_address)` to connect the api with the deployment address.
        - `api_free(string domain_name)` to disassociate a domain name with an address
        - `api_resolve(string domain_name)` to resolve or query a domain name.
        - `api_register(string domain_name, string payment_amount)` to register a domain name and pay for it.
        - `api_price(string domain_name)` to see how much $MATIC you need to buy this domain.
        - `api_send(domain_name, amount)`, to send some $MATIC using domain name instead of address.

# File Structure

- `contracts` is the smart contract code. Used Solidity.
- `scripts` is helpful deployment scripts. Used Hardhat and Alchemy Supernode.
- `test` is helpful testing code. Used Chai and Hardhat.
- `api.js` is the JS api
- `hardhat.config.js` specifies all the network configuration states (keys, endpoints).

# Acknowledgements

Lots of help from the tutorials at https://buildspace.so/