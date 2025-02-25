use starknet::ContractAddress;

#[starknet::interface]
pub trait IScavengerHunt<TContractState> {
    fn add_question(
        ref self: TContractState,
        level: Levels,
        question: ByteArray,
        answer: ByteArray,
        hint: ByteArray,
    );
    fn get_question(self: @TContractState, question_id: u64) -> Question;
    fn set_question_per_level(ref self: TContractState, amount: u8);
    fn get_question_per_level(self: @TContractState, amount: u8) -> u8;
    fn initialize_player_progress(ref self: TContractState, player_address: ContractAddress);
    fn submit_answer(ref self: TContractState, question_id: u64, answer: ByteArray) -> bool;
    fn request_hint(
        self: @TContractState, question_id: u64,
    ) -> ByteArray; // request hint for a question
    fn get_question_in_level(self: @TContractState, level: Levels, index: u8) -> ByteArray;
    fn update_question(
        ref self: TContractState,
        question_id: u64,
        question: ByteArray,
        answer: ByteArray,
        level: Levels,
        hint: ByteArray,
    );
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Question {
    pub question_id: u64,
    pub question: ByteArray,
    pub answer: ByteArray, // TODO: Store hashed answer
    pub level: Levels,
    pub hint: ByteArray,
}

#[derive(Drop, Copy, Serde, PartialEq, starknet::Store)]
pub enum Levels {
    #[default]
    Easy,
    Medium,
    Hard,
    Master,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct PlayerProgress {
    pub address: ContractAddress,
    pub current_level: Levels,
    pub is_initialized: bool,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct LevelProgress {
    pub player: ContractAddress,
    pub level: Levels,
    pub last_question_index: u8, // Index of the last correctly answered question in a level
    pub is_completed: bool,
    pub attempts: u32,
    pub nft_minted: bool,
}

impl LevelsIntoFelt252 of Into<Levels, felt252> {
    fn into(self: Levels) -> felt252 {
        match self {
            Levels::Easy => 'EASY',
            Levels::Medium => 'MEDIUM',
            Levels::Hard => 'HARD',
            Levels::Master => 'MASTER',
        }
    }
}

impl Felt252TryIntoLevels of TryInto<felt252, Levels> {
    fn try_into(self: felt252) -> Option<Levels> {
        if self == 'EASY' {
            Option::Some(Levels::Easy)
        } else if self == 'MEDIUM' {
            Option::Some(Levels::Medium)
        } else if self == 'HARD' {
            Option::Some(Levels::Hard)
        } else if self == 'MASTER' {
            Option::Some(Levels::Master)
        } else {
            Option::None
        }
    }
}
