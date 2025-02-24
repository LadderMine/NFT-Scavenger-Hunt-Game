use starknet::{ContractAddress, contract_address_const};

use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
    stop_cheat_caller_address
};

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait, Question, Levels};

fn ADMIN() -> ContractAddress {
    contract_address_const::<'ADMIN'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'USER'>()
}

fn deploy_contract() -> ContractAddress {
    let contract = declare("ScavengerHunt").unwrap().contract_class();
    let mut constructor_calldata: Array::<felt252> = array![];
    Serde::serialize(@ADMIN(), ref constructor_calldata);
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_set_question_per_level() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    stop_cheat_caller_address(contract_address);

    let question_per_level = dispatcher.get_question_per_level(0);
    assert!(question_per_level == 5, "Expected 5 questions per level, got {}", question_per_level);
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_set_question_per_level_should_panic_with_missing_role() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    dispatcher.set_question_per_level(5);

    let question_per_level = dispatcher.get_question_per_level(0);
    assert!(question_per_level == 5, "Expected 5 questions per level, got {}", question_per_level);
}

#[test]
fn test_add_and_get_question() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Retrieve the question
    let question_id = 1; // Assuming the first question has ID 1
    let retrieved_question: Question = dispatcher.get_question(question_id);

    // Assertions to verify the question was added correctly
    assert!(
        retrieved_question.question_id == question_id,
        "Expected question ID {}, got {}",
        question_id,
        retrieved_question.question_id,
    );
    assert!(
        retrieved_question.question == question,
        "Expected question '{}', got '{}'",
        question,
        retrieved_question.question,
    );
    assert!(
        retrieved_question.answer == answer,
        "Expected answer '{}', got '{}'",
        answer,
        retrieved_question.answer,
    );
    assert!(
        retrieved_question.hint == hint,
        "Expected hint '{}', got '{}'",
        hint,
        retrieved_question.hint,
    );
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_add_and_get_question_should_panic_with_missing_role() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
}

#[test]
fn test_submit_answer() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data
    let level = Levels::Easy;
    let question = "What is 2 + 2?";
    let correct_answer = "4";
    let wrong_answer = "5";
    let hint = "It's an even number";

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), correct_answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // first question is assigned ID 1
    let question_id = 1;

    // Submit a wrong answer first
    let result_wrong = dispatcher.submit_answer(question_id, wrong_answer.clone());
    assert!(!result_wrong, "expected_sub_with_wrong_ans");

    // Submit  correct answer
    let result_correct = dispatcher.submit_answer(question_id, correct_answer.clone());
    assert!(result_correct, "expected_sub_with_correct_ans");
}

#[test]
fn test_request_hint() {
    // Deploy the contract
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    start_cheat_caller_address(contract_address, USER());

    // Define test data
    let level = Levels::Easy;
    let question = "What is the capital of France?"; // ByteArray
    let answer = "Paris"; // ByteArray
    let hint = "It starts with 'P'"; // ByteArray

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Retrieve the hint for the question
    let question_id = 1; // Assuming the first question has ID 1
    let retrieved_hint = dispatcher.request_hint(question_id);

    // Verify that the retrieved hint matches the expected hint
    assert!(retrieved_hint == hint, "Expected hint '{}', got '{}'", hint, retrieved_hint);
}

#[test]
fn test_get_question_in_level() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";
    let index = 0;

    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    let retrieved_question = dispatcher.get_question_in_level(level, index);

    assert!(
        retrieved_question == question,
        "Expected question '{}', got '{}'",
        question,
        retrieved_question,
    );
}

#[test]
fn test_update_question() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define initial test data
    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Define updated test data
    let updated_question = "What is the capital of Germany?";
    let updated_answer = "Berlin";
    let updated_hint = "It starts with 'B'";

    // Update the question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher
        .update_question(
            1, updated_question.clone(), updated_answer.clone(), level, updated_hint.clone()
        );
    stop_cheat_caller_address(contract_address);

    // Retrieve the updated question
    let retrieved_question: Question = dispatcher.get_question(1);

    // Assertions to verify the question was updated correctly
    assert!(
        retrieved_question.question == updated_question,
        "Expected question '{}', got '{}'",
        updated_question,
        retrieved_question.question,
    );
    assert!(
        retrieved_question.answer == updated_answer,
        "Expected answer '{}', got '{}'",
        updated_answer,
        retrieved_question.answer,
    );
    assert!(
        retrieved_question.hint == updated_hint,
        "Expected hint '{}', got '{}'",
        updated_hint,
        retrieved_question.hint,
    );
}

#[test]
#[should_panic(expected: 'Caller is missing role')]
fn test_update_question_should_panic_with_missing_role() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define initial test data
    let level = Levels::Easy;
    let question = "What is the capital of France?";
    let answer = "Paris";
    let hint = "It starts with 'P'";

    // Add a question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.set_question_per_level(5);
    dispatcher.add_question(level, question.clone(), answer.clone(), hint.clone());
    stop_cheat_caller_address(contract_address);

    // Define updated test data
    let updated_question = "What is the capital of Germany?";
    let updated_answer = "Berlin";
    let updated_hint = "It starts with 'B'";

    // Attempt to update the question without admin role
    dispatcher
        .update_question(
            1, updated_question.clone(), updated_answer.clone(), level, updated_hint.clone()
        );
}

#[test]
#[should_panic(expected: "Question does not exist")]
fn test_update_question_should_panic_if_question_does_not_exist() {
    let contract_address = deploy_contract();
    let dispatcher = IScavengerHuntDispatcher { contract_address };

    // Define test data for updating a non-existent question
    let invalid_question_id = 1; // This question ID does not exist yet
    let question = "What is the capital of France?";
    let answer = "Paris";
    let level = Levels::Easy;
    let hint = "It starts with 'P'";

    // Attempt to update a non-existent question
    start_cheat_caller_address(contract_address, ADMIN());
    dispatcher.update_question(invalid_question_id, question, answer, level, hint);
    stop_cheat_caller_address(contract_address);
}
