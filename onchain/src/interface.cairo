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
}

#[derive(Drop, Copy, Serde, PartialEq, starknet::Store)]
pub enum Levels {
    Easy,
    Medium,
    Hard,
    Master,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct PlayerProgress {
    pub address: ContractAddress,
    pub current_level: Levels,
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
