#[starknet::contract]
mod ScavengerHunt {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess,
        StorageMapWriteAccess, Map,
    };
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use AccessControlComponent::InternalTrait;
    use onchain::interface::{IScavengerHunt, Question, Levels, PlayerProgress, LevelProgress};

    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // SRC5
    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[storage]
    struct Storage {
        questions: Map<u64, Question>,
        question_count: u64,
        questions_by_level: Map<(felt252, u64), u64>, // (levels, index) -> question_id
        question_per_level: u8,
        player_progress: Map<ContractAddress, PlayerProgress>,
        player_level_progress: Map<
            (ContractAddress, felt252), LevelProgress,
        >, // (user, level) -> LevelProgress
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        QuestionAdded: QuestionAdded,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[derive(Drop, starknet::Event)]
    pub struct QuestionAdded {
        pub question_id: u64,
        pub level: Levels,
    }

    #[constructor]
    fn constructor(ref self: ContractState, admin: ContractAddress) {
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(ADMIN_ROLE, admin);
    }

    #[abi(embed_v0)]
    impl ScavengerHuntImpl of IScavengerHunt<ContractState> {
        // Add a new question to the contract
        fn add_question(
            ref self: ContractState,
            level: Levels,
            question: ByteArray,
            answer: ByteArray,
            hint: ByteArray,
        ) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);

            let question_id = self.question_count.read()
                + 1; // Increment the question count and use it as the ID

            self.question_count.write(question_id); // Update the question count

            let new_question = Question { question_id, question, answer, level, hint };

            // Store the new question in the `questions` map
            self.questions.write(question_id, new_question);

            // Store the new question by level

            self.questions_by_level.write((level.into(), question_id), question_id);

            // Emit event
            self.emit(QuestionAdded { question_id, level });
        }

        // Get a question by question_id
        fn get_question(self: @ContractState, question_id: u64) -> Question {
            // Retrieve the question from storage using the question_id
            self.questions.read(question_id)
        }

        fn set_question_per_level(ref self: ContractState, amount: u8) {
            self.accesscontrol.assert_only_role(ADMIN_ROLE);
            assert!(amount > 0, "Question per level must be greater than 0");
            self.question_per_level.write(amount);
        }

        fn get_question_per_level(self: @ContractState, amount: u8) -> u8 {
            self.question_per_level.read()
        }

        fn submit_answer(ref self: ContractState, question_id: u64, answer: ByteArray) -> bool {
            let question_data = self.questions.read(question_id);
            let caller = get_caller_address(); // Fetch caller's address

            let mut level_progress = self
                .player_level_progress
                .read((caller, question_data.level.into()));

            // Increment attempts regardless of correctness
            level_progress.attempts += 1;

            if question_data.answer == answer {
                // Correct answer
                level_progress.last_question_index += 1;

                let total_questions = self.question_per_level.read();
                if level_progress.last_question_index >= total_questions {
                    level_progress.is_completed = true;
                }

                // Update storage
                self
                    .player_level_progress
                    .write((caller, question_data.level.into()), level_progress);
                return true;
            }

            // Update storage for attempts
            self.player_level_progress.write((caller, question_data.level.into()), level_progress);
            false
        }
    }
}
