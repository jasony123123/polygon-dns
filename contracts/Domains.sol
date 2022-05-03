// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {StringUtils} from "./libraries/StringUtils.sol";
import {Base64} from "./libraries/Base64.sol";

import "hardhat/console.sol";

contract DomainNameService is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public constant tld = ".matic";
    mapping(string => address) public domains;

    constructor() ERC721("Polygon Name Service", "maticDNS") {
        console.log("%s name service deployed", tld);
    }

    function register(string calldata name) public payable {
        require(domains[name] == address(0)); // domain name must be available
        require(msg.value >= price(name), "Not enough Matic paid"); // must pay enough money

        string memory domain_name = string(abi.encodePacked(name, tld));

        uint256 newRecordId = _tokenIds.current();
        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, domain_name);
        domains[name] = msg.sender;
        _tokenIds.increment();

        console.log(
            "Successfully registered `%s` on the with tokenID %d, mapping to %s",
            domain_name,
            newRecordId,
            msg.sender
        );
    }

    function free(string calldata name) public {
        require(domains[name] == msg.sender, "must be owner to free");
        domains[name] = address(0);
    }

    function price(string calldata name) public pure returns (uint256) {
        uint256 len = StringUtils.strlen(name);
        require(len > 0);
        if (len <= 3) {
            return 9 * 10**15;
        } else if (len <= 9) {
            return 3 * 10**15;
        } else {
            return 1 * 10**15;
        }
    }

    function resolve(string calldata name) public view returns (address) {
        return domains[name];
    }
}
