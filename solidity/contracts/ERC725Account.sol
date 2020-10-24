// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.0;

// modules
import "./ERC725.sol";
import "./IERC1271.sol";

// libraries
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "./helpers/UtilsLib.sol";

/**
 * @title ERC725Account
 * @dev Bundles ERC725X and ERC725Y, and ERC1271 and allows receiving native tokens.
 *
 *  @author Fabian Vogelsteller <fabian@lukso.network>
 */

// TODO add ERC777, ERC223, ERC721 functions?

contract ERC725Account is ERC725, IERC1271 {
    bytes4 internal constant _INTERFACE_ID_ERC1271 = 0x1626ba7e;
    bytes4 internal constant _ERC1271FAILVALUE = 0xffffffff;

    event ValueReceived(address indexed sender, uint256 indexed value);

    /**
     * @notice Sets the owner of the contract
     * @param _newOwner the owner of the contract.
     */
    constructor(address _newOwner) public ERC725(_newOwner) {
        bytes32 key = keccak256("ERC725Type");
        store[key] = abi.encodePacked(keccak256("ERC725Account"));
        emit DataChanged(key, store[key]);

        _registerInterface(_INTERFACE_ID_ERC1271);
    }

    receive() external payable {
        emit ValueReceived(_msgSender(), msg.value);
    }

    //    TODO to be discussed
    //    function fallback()
    //    public
    //    {
    //        address to = owner();
    //        assembly {
    //            calldatacopy(0, 0, calldatasize())
    //            let result := staticcall(gas(), to, 0, calldatasize(), 0, 0)
    //            returndatacopy(0, 0, returndatasize())
    //            switch result
    //            case 0  { revert (0, returndatasize()) }
    //            default { return (0, returndatasize()) }
    //        }
    //    }

    /**
     * @notice Checks if an owner signed `_data`.
     * ERC1271 interface.
     *
     * @param _hash hash of the data signed//Arbitrary length data signed on the behalf of address(this)
     * @param _signature owner's signature(s) of the data
     */
    function isValidSignature(bytes32 _hash, bytes memory _signature)
        public
        override
        view
        returns (bytes4 magicValue)
    {
        if (
            UtilsLib.isContract(owner()) &&
            supportsInterface(_INTERFACE_ID_ERC1271)
        ) {
            return IERC1271(owner()).isValidSignature(_hash, _signature);
        } else {
            return
                owner() == ECDSA.recover(_hash, _signature)
                    ? _INTERFACE_ID_ERC1271
                    : _ERC1271FAILVALUE;
        }
    }
}
