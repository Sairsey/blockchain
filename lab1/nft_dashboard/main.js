let serverUrl = "https://ytd94udm4oeh.usemoralis.com:2053/server"; //Server url from moralis.io
let appId = "jWW0NAdb0GydYUEvJtm1TSF2jdqwjL7aHiW89LnE"; // Application id from moralis.io
let contract_addr = "0x4577cbfc5b63c62dd569bf0e6310f3368f3dfe70";
Moralis.start({ serverUrl, appId });
let currentUser;

function fetchNFTMetadata(NFTs) {
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // Call Moralis
        promises.push(fetch(serverUrl + "/functions/" + "getNFT" + "?_ApplicationId=" + appId + "&nftId=" + id)
            .then(res => res.json())
            .then(res => JSON.parse(res.result))
            .then(res => { nft.metadata = res })
            .then(res => {
                const options = { address: contract_addr, token_id: id, chain: "rinkeby" };
                return Moralis.Web3API.token.getTokenIdOwners(options);
            })
            .then((res) => {
                nft.owners = [];
                res.result.forEach(element => {
                    nft.owners.push(element.owner_of);
                });
                return nft;
            }));
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        let htmlString =
            `<div class="card">
               <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
               <div class="card-body">
                 <h5 class="card-title">${nft.metadata.name}</h5>
                 <p class="card-text">${nft.metadata.description}</p>
                 <p class="card-text">Amount: ${nft.amount}</p>
                 <p class="card-text">Number of owners: ${nft.owners.length}</p>
                 <p class="card-text">Your's balance: ${ownerData[nft.token_id]}</p>
                 <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                 <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
               </div>
             </div>`;
        let col = document.createElement("div");
        col.className = "col col-md-3";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = { address: accounts[0], token_address: contract_addr, chain: "rinkeby" };
    return Moralis.Web3API.account.getNFTsForContract(options).then(
        (data) => {
            let result = data.result.reduce((object, element) => {
                object[element.token_id] = element.amount;
                return object;
            }, {});
            console.log(result);
            return result;
        }
    )
}

async function login() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        currentUser = await Moralis.authenticate();
    }
    const options = { address: contract_addr, chain: "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    console.log(NFTs);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();
    console.log(NFTWithMetadata);
    renderInventory(NFTWithMetadata, ownerData);
}

login();