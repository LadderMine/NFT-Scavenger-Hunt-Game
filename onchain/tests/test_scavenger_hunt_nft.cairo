use onchain::contracts::scavenger_hunt_nft::{
    IScavengerHuntNFTDispatcher, IScavengerHuntNFTDispatcherTrait,
};
use onchain::interface::Levels;
use openzeppelin::token::erc1155::interface::{IERC1155Dispatcher, IERC1155DispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::ContractAddress;

// Define for testing
const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

// Helper function to deploy the ScavengerHuntNFT contract
fn deploy_contract(scavenger_hunt_contract: ContractAddress) -> ContractAddress {
    let base_uri: ByteArray = "https://scavenger_hunt_nft.com/";

    let mut constructor_calldata: Array<felt252> = ArrayTrait::new();

    base_uri.serialize(ref constructor_calldata);

    // Add scavenger_hunt_contract address to constructor calldata
    constructor_calldata.append(scavenger_hunt_contract.into());

    let contract = declare("ScavengerHuntNFT").unwrap().contract_class();

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}

// Helper function to deploy the MockERC1155Receiver contract
fn deploy_mock_receiver() -> ContractAddress {
    let contract = declare("MockERC1155Receiver").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();

    contract_address
}


#[test]
fn test_mint_single_badge() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };
    let erc1155 = IERC1155Dispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Set caller address to scavenger_hunt_address to simulate call from ScavengerHunt contract
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Mint an Easy badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);

    stop_cheat_caller_address(contract_address);

    // Check badge ownership using has_level_badge
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Easy), 'Should have Easy badge');

    // Check badge ownership using ERC1155 balance_of directly
    let token_id = Levels::Easy.into();

    assert(erc1155.balance_of(recipient, token_id) == 1_u256, 'Should have balance of 1');

    // Verify recipient doesn't have other badges
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Medium), 'Should not have Medium badge',
    );
    assert(!scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should not have Hard badge');
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Master), 'Should not have Master badge',
    );
}

// Test minting multiple different badges to the same recipient
#[test]
fn test_mint_multiple_badges() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test address
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Set caller address to scavenger_hunt_address to simulate call from ScavengerHunt contract
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Mint badges for multiple levels
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);
    scavenger_hunt.mint_level_badge(recipient, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient, Levels::Hard);

    stop_cheat_caller_address(contract_address);

    // Check all badges were minted correctly
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Easy), 'Should have Easy badge');
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Medium), 'Should have Medium badge');
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should have Hard badge');
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Master), 'Should not have Master badge',
    );
}

// Test minting badges to different recipients
#[test]
fn test_mint_to_different_recipients() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    // Deploy two different receivers
    let recipient1 = deploy_mock_receiver();
    let recipient2 = deploy_mock_receiver();

    // Set caller address to scavenger_hunt_address to simulate call from ScavengerHunt contract
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Mint badges to different recipients
    scavenger_hunt.mint_level_badge(recipient1, Levels::Easy);
    scavenger_hunt.mint_level_badge(recipient1, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient2, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient2, Levels::Hard);

    stop_cheat_caller_address(contract_address);

    // Check recipient1's badges
    assert(scavenger_hunt.has_level_badge(recipient1, Levels::Easy), 'Recipient1 should have Easy');
    assert(
        scavenger_hunt.has_level_badge(recipient1, Levels::Medium), 'Recipient1 should have Medium',
    );
    assert(
        !scavenger_hunt.has_level_badge(recipient1, Levels::Hard),
        'Recipient1 should not have Hard',
    );

    // Check recipient2's badges
    assert(
        !scavenger_hunt.has_level_badge(recipient2, Levels::Easy),
        'Recipient2 should not have Easy',
    );
    assert(
        scavenger_hunt.has_level_badge(recipient2, Levels::Medium), 'Recipient2 should have Medium',
    );
    assert(scavenger_hunt.has_level_badge(recipient2, Levels::Hard), 'Recipient2 should have Hard');
}

// Test duplicate minting (should fail)
#[test]
#[should_panic(expected: 'Already has this badge')]
fn test_duplicate_minting() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Set caller address to scavenger_hunt_address to simulate call from ScavengerHunt contract
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Mint a badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);

    // Try to mint the same badge again (should fail)
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);

    stop_cheat_caller_address(contract_address);
}

// Test ERC1155 standard compliance
#[test]
fn test_erc1155_compliance() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let erc1155 = IERC1155Dispatcher { contract_address };
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    let token_id = Levels::Master.into();

    // Check initial balance is zero
    assert(
        erc1155.balance_of(recipient, token_id) == u256 { low: 0, high: 0 },
        'Initial balance should be 0',
    );

    // Set caller address to scavenger_hunt_address to simulate call from ScavengerHunt contract
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Mint a badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Master);

    stop_cheat_caller_address(contract_address);

    // Check balance is now one
    assert(
        erc1155.balance_of(recipient, token_id) == u256 { low: 1, high: 0 },
        'Balance should be 1 after mint',
    );
}

// Test for non-existent badge
#[test]
fn test_non_existent_badge() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Check badge ownership for a badge that hasn't been minted
    assert(!scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should not have Hard badge');
}


// New tests for access control functionality

// Test unauthorized mint (should fail)
#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_unauthorized_mint() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();
    let unauthorized_address: ContractAddress = 0x789.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Set caller address to unauthorized_address to simulate call from an unauthorized address
    start_cheat_caller_address(contract_address, unauthorized_address);

    // Try to mint as unauthorized caller (should fail)
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);
}

// Test that ScavengerHunt contract has the minter role by default
#[test]
fn test_scavenger_hunt_has_minter_role() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    // Check if ScavengerHunt contract has minter role
    assert(
        scavenger_hunt.has_minter_role(scavenger_hunt_address), 'ScavengerHunt should have role',
    );
}

#[test]
fn test_grant_revoke_minter_role() {
    // Create mock addresses for testing
    let scavenger_hunt_address: ContractAddress = 0x456.try_into().unwrap();
    let new_minter_address: ContractAddress = 0x789.try_into().unwrap();

    // Deploy the contract with our test addresses
    let contract_address = deploy_contract(scavenger_hunt_address);
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Check if new_minter_address has minter role (should be false)
    assert(!scavenger_hunt.has_minter_role(new_minter_address), 'Should not have minter role');

    // Set caller address to scavenger_hunt_address which should have both MINTER_ROLE and
    // DEFAULT_ADMIN_ROLE
    start_cheat_caller_address(contract_address, scavenger_hunt_address);

    // Grant minter role to new_minter_address
    scavenger_hunt.grant_minter_role(new_minter_address);

    stop_cheat_caller_address(contract_address);

    // Check if new_minter_address now has minter role
    assert(scavenger_hunt.has_minter_role(new_minter_address), 'Should have minter role');

    // Test that new_minter_address can mint
    start_cheat_caller_address(contract_address, new_minter_address);
    scavenger_hunt.mint_level_badge(recipient, Levels::Medium);
    stop_cheat_caller_address(contract_address);

    // Verify the mint worked
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Medium), 'New minter should mint');

    // Set caller back to scavenger_hunt_address to revoke role
    start_cheat_caller_address(contract_address, scavenger_hunt_address);
    scavenger_hunt.revoke_minter_role(new_minter_address);
    stop_cheat_caller_address(contract_address);

    // Check if role was revoked
    assert(!scavenger_hunt.has_minter_role(new_minter_address), 'Role should be revoked');
}
