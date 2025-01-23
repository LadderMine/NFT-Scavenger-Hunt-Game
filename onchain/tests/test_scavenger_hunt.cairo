use starknet::ContractAddress;

use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

use onchain::interface::{IScavengerHuntDispatcher, IScavengerHuntDispatcherTrait};

fn deploy_contract() -> ContractAddress {
    let contract = declare("ScavengerHunt").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}
#[test]
fn test_addition() {
    assert_eq!(2, 1 + 1);
}

// #[test]
// fn test() {
// }

