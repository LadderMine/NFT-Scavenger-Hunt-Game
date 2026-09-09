use onchain::contracts::scavenger_hunt_nft::{
    IScavengerHuntNFTDispatcher, IScavengerHuntNFTDispatcherTrait,
};
use onchain::interface::Levels;
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;

// Additional unit tests for the NFT minting contract function (#613),
// covering successful mint after a role change and unauthorized mint
// after a previously-granted role has been revoked.

fn deploy_contract(scavenger_hunt_contract: ContractAddress) -> ContractAddress {
    let base_uri: ByteArray = "https://scavenger_hunt_nft.com/";

    let mut constructor_calldata: Array<felt252> = ArrayTrait::new();

    base_uri.serialize(ref constructor_calldata);
    constructor_calldata.append(scavenger_hunt_contract.into());

    let contract = declare("ScavengerHuntNFT").unwrap().contract_class();

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

fn deploy_mock_receiver() -> ContractAddress {
    let contract = declare("MockERC1155Receiver").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();

    contract_address
}

// Successful mint: a freshly granted minter can mint a badge.
#[test]
fn test_mint_succeeds_for_newly_granted_minter() {
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();
    let new_minter_address: ContractAddress = 0xabc.try_into().unwrap();

    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    start_cheat_caller_address(contract_address, scavenger_hunt_address);
    scavenger_hunt.grant_minter_role(new_minter_address);
    stop_cheat_caller_address(contract_address);

    start_cheat_caller_address(contract_address, new_minter_address);
    scavenger_hunt.mint_level_badge(recipient, Levels::Hard);
    stop_cheat_caller_address(contract_address);

    assert(scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should have Hard badge');
}

// Failure case: minting must be rejected once the minter role has been revoked.
#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_mint_fails_after_role_revoked() {
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();
    let minter_address: ContractAddress = 0xdef.try_into().unwrap();

    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    start_cheat_caller_address(contract_address, scavenger_hunt_address);
    scavenger_hunt.grant_minter_role(minter_address);
    scavenger_hunt.revoke_minter_role(minter_address);
    stop_cheat_caller_address(contract_address);

    // Should panic: minter_address no longer holds MINTER_ROLE.
    start_cheat_caller_address(contract_address, minter_address);
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);
    stop_cheat_caller_address(contract_address);
}
