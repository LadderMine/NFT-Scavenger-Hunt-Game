use starknet::ContractAddress;
//us
use onchain::interface::{Levels};

#[starknet::interface]
pub trait IScavengerHuntNFT<TContractState> {
    fn mint_level_badge(ref self: TContractState, recipient: ContractAddress, level: Levels,);

    fn has_level_badge(self: @TContractState, owner: ContractAddress, level: Levels) -> bool;
}

#[starknet::contract]
mod ScavengerHuntNFT {
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc1155::{ERC1155Component, ERC1155HooksEmptyImpl};
    use starknet::ContractAddress;
    use super::{Levels};

    component!(path: ERC1155Component, storage: erc1155, event: ERC1155Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc1155: ERC1155Component::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC1155Event: ERC1155Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[constructor]
    fn constructor(ref self: ContractState, token_uri: ByteArray) {
        // Initialize ERC-1155 with metadata URI
        self.erc1155.initializer(token_uri);
    }

    #[abi(embed_v0)]
    impl ERC1155Impl = ERC1155Component::ERC1155MixinImpl<ContractState>;

    impl ERC1155InternalImpl = ERC1155Component::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl ScavengerHuntNFTImpl of super::IScavengerHuntNFT<ContractState> {
        // Mint a level badge (exactly one token)
        fn mint_level_badge(ref self: ContractState, recipient: ContractAddress, level: Levels,) {
            // Get token ID for the specified level
            let token_id = level.into();

            // Check if recipient already has this badge
            let balance = self.erc1155.balance_of(recipient, token_id);
            assert(balance == 0_u256, 'Already has this badge');

            // Mint exactly one token
            self.erc1155.mint_with_acceptance_check(recipient, token_id, 1_u256, array![].span());
        }


        // Check if a player has a specific level badge
        fn has_level_badge(self: @ContractState, owner: ContractAddress, level: Levels) -> bool {
            let token_id = level.into();
            let balance = self.erc1155.balance_of(owner, token_id);
            balance > 0_u256
        }
    }
}
