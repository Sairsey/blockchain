pragma solidity ^0.8.0;


// import ERC1155
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract MyNFTContract is ERC1155, Ownable {

    uint256 public constant RED = 0;
    uint256 public constant GREEN = 1;
    uint256 public constant BLUE = 2;
	uint256 public constant CHAD = 3;

    constructor() ERC1155("https://ck5fx4ai9ebh.usemoralis.com/{id}.json") {
        _mint(msg.sender, RED, 1, "");
        _mint(msg.sender, GREEN, 1, "");
        _mint(msg.sender, BLUE, 1, "");
		_mint(msg.sender, CHAD, 1, "");
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }
}