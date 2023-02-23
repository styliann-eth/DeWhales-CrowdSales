pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeWhaleToken is ERC20, Ownable {
    constructor() ERC20("DeWhaleToken", "DWT") {}

    function mint(address to, uint amount) public onlyOwner {
        _mint(to, amount);
    }
}
