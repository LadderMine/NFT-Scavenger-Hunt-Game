use snforge_std::DeclareResultTrait;
use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait};
use openzeppelin::token::{erc1155::interface::{IERC1155Dispatcher, IERC1155DispatcherTrait}};
use onchain::scavenger_hunt_nft::{IScavengerHuntNFTDispatcher, IScavengerHuntNFTDispatcherTrait};
use onchain::interface::{Levels};

// Helper function to deploy the ScavengerHuntNFT contract
fn deploy_contract() -> ContractAddress {
    let base_uri: ByteArray = "https://scavenger_hunt_nft.com/";

    let mut constructor_calldata: Array<felt252> = ArrayTrait::new();

    base_uri.serialize(ref constructor_calldata);

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
    let contract_address = deploy_contract();
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };
    let erc1155 = IERC1155Dispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Mint an Easy badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);

    // Check badge ownership using has_level_badge
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Easy), 'Should have Easy badge');

    // Check badge ownership using ERC1155 balance_of directly
    let token_id = Levels::Easy.into();

    assert(erc1155.balance_of(recipient, token_id) == 1_u256, 'Should have balance of 1');

    // Verify recipient doesn't have other badges
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Medium), 'Should not have Medium badge'
    );
    assert(!scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should not have Hard badge');
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Master), 'Should not have Master badge'
    );
}

// Test minting multiple different badges to the same recipient
#[test]
fn test_mint_multiple_badges() {
    let contract_address = deploy_contract();
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Mint badges for multiple levels
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);
    scavenger_hunt.mint_level_badge(recipient, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient, Levels::Hard);

    // Check all badges were minted correctly
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Easy), 'Should have Easy badge');
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Medium), 'Should have Medium badge');
    assert(scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should have Hard badge');
    assert(
        !scavenger_hunt.has_level_badge(recipient, Levels::Master), 'Should not have Master badge'
    );
}

// Test minting badges to different recipients
#[test]
fn test_mint_to_different_recipients() {
    let contract_address = deploy_contract();
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    // Deploy two different receivers
    let recipient1 = deploy_mock_receiver();
    let recipient2 = deploy_mock_receiver();

    // Mint badges to different recipients
    scavenger_hunt.mint_level_badge(recipient1, Levels::Easy);
    scavenger_hunt.mint_level_badge(recipient1, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient2, Levels::Medium);
    scavenger_hunt.mint_level_badge(recipient2, Levels::Hard);

    // Check recipient1's badges
    assert(scavenger_hunt.has_level_badge(recipient1, Levels::Easy), 'Recipient1 should have Easy');
    assert(
        scavenger_hunt.has_level_badge(recipient1, Levels::Medium), 'Recipient1 should have Medium'
    );
    assert(
        !scavenger_hunt.has_level_badge(recipient1, Levels::Hard), 'Recipient1 should not have Hard'
    );

    // Check recipient2's badges
    assert(
        !scavenger_hunt.has_level_badge(recipient2, Levels::Easy), 'Recipient2 should not have Easy'
    );
    assert(
        scavenger_hunt.has_level_badge(recipient2, Levels::Medium), 'Recipient2 should have Medium'
    );
    assert(scavenger_hunt.has_level_badge(recipient2, Levels::Hard), 'Recipient2 should have Hard');
}

// Test duplicate minting (should fail)
#[test]
#[should_panic(expected: 'Already has this badge')]
fn test_duplicate_minting() {
    let contract_address = deploy_contract();
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Mint a badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);

    // Try to mint the same badge again (should fail)
    scavenger_hunt.mint_level_badge(recipient, Levels::Easy);
}

// Test ERC1155 standard compliance
#[test]
fn test_erc1155_compliance() {
    let contract_address = deploy_contract();
    let erc1155 = IERC1155Dispatcher { contract_address };
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    let token_id = Levels::Master.into();

    // Check initial balance is zero
    assert(
        erc1155.balance_of(recipient, token_id) == u256 { low: 0, high: 0 },
        'Initial balance should be 0'
    );

    // Mint a badge
    scavenger_hunt.mint_level_badge(recipient, Levels::Master);

    // Check balance is now one
    assert(
        erc1155.balance_of(recipient, token_id) == u256 { low: 1, high: 0 },
        'Balance should be 1 after mint'
    );
}

// Test for non-existent badge
#[test]
fn test_non_existent_badge() {
    let contract_address = deploy_contract();
    let scavenger_hunt = IScavengerHuntNFTDispatcher { contract_address };

    let recipient = deploy_mock_receiver();

    // Check badge ownership for a badge that hasn't been minted
    assert(!scavenger_hunt.has_level_badge(recipient, Levels::Hard), 'Should not have Hard badge');
}

