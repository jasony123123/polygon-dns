const { assert } = require("chai");

const main = async () => {
    const [owner, google, bing, user] = await hre.ethers.getSigners();
    let domainContract;
    try {
        const domainContractFactory = await hre.ethers.getContractFactory('DomainNameService');
        domainContract = await domainContractFactory.deploy();
        await domainContract.deployed();
        console.log("[SUCCESS] Contract deployed to:", domainContract.address);
    } catch (error) {
        console.log("[FAIL] deployment failed", error);
    }

    try {
        txn = await domainContract.connect(google).register("google", { value: hre.ethers.utils.parseEther('0.001') });
        await txn.wait();
        console.log("[FAIL] google was able to register without paying enough")
    } catch (error) {
        console.log("[SUCCESS] google was not able to register without paying: ", error.message)
    }

    try {
        txn = await domainContract.connect(google).register("google", { value: hre.ethers.utils.parseEther('0.003') });
        await txn.wait();
        txn = await domainContract.connect(bing).register("bing", { value: hre.ethers.utils.parseEther('0.003') });
        await txn.wait();
        console.log("[SUCCESS] google and bing were able to register")
    } catch (error) {
        console.log("[FAIL] google or bing was not able to register: ", error.message)
    }

    try {
        const address = await domainContract.connect(user).resolve("google");
        assert(address == google.address, address + "!=" + google.address)
        console.log("[SUCCESS] resolved address for google (%s) matches (%s)", address, google.address);
    } catch (error) {
        console.log("[FAIL] resolved address for google doesn't match", error.message)
    }

    try {
        const address = await domainContract.connect(user).resolve("bing");
        assert(address == bing.address, address + "!=" + bing.address)
        console.log("[SUCCESS] resolved address for bing (%s) matches (%s)", address, bing.address);
    } catch (error) {
        console.log("[FAIL] resolved address for bing doesn't match", error.message)
    }

    try {
        tx = await domainContract.connect(google).free("bing");
        await tx.wait()
        console.log("[FAIL] Google freed Bing's address")
    } catch (error) {
        console.log("[SUCCESS] Google can't free Bing's address", error.message)
    }

    try {
        tx = await domainContract.connect(bing).free("bing");
        await tx.wait()
        console.log("[SUCCESS] Bing freed Bing's address")
    } catch (error) {
        console.log("[FAIL] Bing can't free Bing's address", error.message)
    }

    try {
        const balance = await hre.ethers.provider.getBalance(domainContract.address);
        assert(balance >= 6 * 10 ** 15, 'contract balance insufficient')
        console.log("[SUCCCESS] Contract balance sufficient:", hre.ethers.utils.formatEther(balance));
    } catch (error) {
        console.log("[FAIL]", error.message);
    }
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();