use core::array::ArrayTrait;
use core::byte_array::ByteArray;
use core::felt252;
use core::poseidon::poseidon_hash_span;

pub fn hash_byte_array(byte_array: ByteArray) -> felt252 {
    let mut felt_array: Array<felt252> = ArrayTrait::new();
    let len = byte_array.len();
    let mut i: usize = 0;

    while i != len {
        let byte = byte_array.at(i).unwrap();
        felt_array.append(byte.into());
        i += 1;
    };

    poseidon_hash_span(felt_array.span())
}

