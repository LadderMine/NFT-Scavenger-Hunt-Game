use starknet::ContractAddress;

#[starknet::interface]
pub trait IScavengerHunt<TContractState> {
    fn set_question_per_level(ref self: TContractState, amount: u8);
    fn get_question_per_level(self: @TContractState, amount: u8) -> u8;
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
