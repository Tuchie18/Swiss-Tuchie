const hre = require("hardhat"); 
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
    const rpcLink = hre.network.config.url;
    const [encryptedData] = await encryptDataField(rpcLink, data);
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
};

async function main() {
    const contractAddress = "0x6F4e5c07bF24Cb0B2567620A3EB5617cc7Ed7d10";
    const [signer] = await hre.ethers.getSigners();

    const contractFactory = await hre.ethers.getContractFactory("TestToken");
    const contract = contractFactory.attach(contractAddress);

    const functionName = "mint100tokens";
    const mint100tokensTx = await sendShieldedTransaction(
        signer,
        contractAddress,
        contract.interface.encodeFunctionData(functionName), 
        0
    );

    await mint100tokensTx.wait();
    console.log("Transaction Receipt:", mint100tokensTx.hash); 
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
