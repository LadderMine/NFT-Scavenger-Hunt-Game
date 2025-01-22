#[starknet::contract]
mod ScavengerHunt {
    use starknet::ContractAddress;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };
    use onchain::interface::{IScavengerHunt, Question, Levels, PlayerProgress, LevelProgress};

    #[storage]
    struct Storage {
        questions: Map<u64, Question>,
        question_count: u64,
        questions_by_level: Map<(Levels, u64), u64>, // (levels, index) -> question_id
        question_per_level: u8,
        player_progress: Map<ContractAddress, PlayerProgress>,
        player_level_progress: Map<ContractAddress, LevelProgress>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {
        //TODO
        fn set_question_per_level(ref self: ContractState, amount: u8) {}

        //TODO
        fn get_question_per_level(self: @ContractState, amount: u8) -> u8 {
            1
        }
    }
}
