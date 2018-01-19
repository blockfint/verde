pragma solidity ^0.4.17;

contract UserDirectory {

	mapping (string => address) private _users;
	uint public userCount;

	function UserDirectory() public {
		userCount = 0;
	}

	function newUser(
		string _id,
		address _userContractAddress
	    ) public {
			_users[_id] = _userContractAddress;
			userCount++;
	}

	function findUserByID(string id) 
			public view returns (address userContractAddress) {
		return (userContractAddress = _users[id]);
	}
}