let serverUrl = "https://ytd94udm4oeh.usemoralis.com:2053/server"; //Server url from moralis.io
let appId = "jWW0NAdb0GydYUEvJtm1TSF2jdqwjL7aHiW89LnE"; // Application id from moralis.io
let contract_addr = "0x4577cbfc5b63c62dd569bf0e6310f3368f3dfe70";
Moralis.start({ serverUrl, appId });

async function login() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    await Moralis.enableWeb3();
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");

    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let token_id = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts[0]);
    const options = {
        type: "erc1155",
        receiver: address,
        contractAddress: contract_addr,
        tokenId: token_id.toString(),
        amount: amount
    };

    const transaction = await Moralis.transfer(options);
    const result = await transaction.wait();
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

login();