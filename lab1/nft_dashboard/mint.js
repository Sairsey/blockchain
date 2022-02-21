let serverUrl = "https://ytd94udm4oeh.usemoralis.com:2053/server"; //Server url from moralis.io
let appId = "jWW0NAdb0GydYUEvJtm1TSF2jdqwjL7aHiW89LnE"; // Application id from moralis.io
let contract_addr = "0x4577cbfc5b63c62dd569bf0e6310f3368f3dfe70";
Moralis.start({ serverUrl, appId });
let web3;

async function login() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    const web3Provider = await Moralis.enableWeb3();
    web3 = new Web3(Moralis.provider);
    let accounts = await web3.eth.getAccounts();
    
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");

    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts[0];
}

async function mint() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    let accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts[0]);
    const contract = new web3.eth.Contract(contractABI, contract_addr);
    contract.methods.mint(address, tokenId, amount).send({ from: accounts[0], value: 0 })
        .on("receipt", function (receipt) {
            alert("Mint done");
        });
}

document.getElementById("submit_mint").onclick = mint;

login();