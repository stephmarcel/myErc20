pragma solidity >=0.4.2 <0.6.0;

contract Election {

    // Model a Candidate
    struct Candidate {
      uint id;
      string name;
      uint voteCount;
    }

    // Read/write candidate
    //string public candidate;
    mapping (uint => Candidate) public candidates;

    //Store Candidates Count
    uint public candidatesCount;

    //Store accounts that have voted
    mapping (address => bool) public voters;

    //Store the balance accounts
    mapping(address => uint) balances;

    event votedEvent(uint indexed _candidateId);

    event rechargedEvent(address to);

    // Constructor
    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
      candidatesCount ++;
      candidates[candidatesCount] = Candidate(candidatesCount,_name,0);
    }

    function vote(uint _candidateId) public {
      // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

    function recharge(address from,address to) public returns (bool success) {
    balances[from] = balances[from] - 10;
    balances[to] = balances[from] + 10;
    emit rechargedEvent(to);
    return true;
}
}
