App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // if (typeof web3 !== 'undefined') {
    //   // If a web3 instance is already provided by Meta Mask.
    //   App.web3Provider = web3.currentProvider;
    //   web3 = new Web3(web3.currentProvider);
    // } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
  //  }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var totalVote = 0;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    if (App.account == '0x0') {
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });
  }

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
          totalVote = totalVote + parseInt(voteCount);
          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
        candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to voted
      if (hasVoted) {
        //$('form').hide();
        $("#formVote").hide();
        }
    else {
      $("#formVote").show();
        }
      loader.hide();
      content.show();
        $("#NbTotalVote").html("Total Vote: " + totalVote);
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  listenForEvents: function() {
  App.contracts.Election.deployed().then(function(instance) {
    instance.votedEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event) {
      console.log("event triggered", event)
      // Reload when a new vote is recorded
      App.render();
    });
  });
},

gotoVoteForm: function(){
  App.account =  $("#addressfield").val();
    $("#accountAddress").html("Your Account: " + res);
    $("#generateAccountModal").modal('dispose');
    $("#generateAccountModal").modal('hide');
},

generateAccount: function(){

var electionInstance;
var password = $("#passwordfield").val();
var addressGen = document.getElementById('addressfield');
var from = web3.eth.accounts[0];
    web3.personal.newAccount(password, function(err, res) {
      if (err == null) {
        App.account = res;
        console.log("error: "+err);
        console.log("res: "+res);
        console.log("App.account: "+ App.account);
        console.log("from:"+ from);

addressGen.value = res;
        // Unlock account
        web3.personal.unlockAccount(res, password, 1600);

        //Transfer 10 ether to the new generate account
        web3.eth.sendTransaction({
          from: from,
          to: res,
          value: web3.toWei(10)
        },password);

          console.log("Balance du compte dest:"+res+"-"+ web3.fromWei(web3.eth.getBalance(res)));
          console.log("Balance du compte exp:"+ from +"-"+web3.fromWei(web3.eth.getBalance(from)));


        $("#accountAddress").html("Your Account: " + res);

        // Refresh page
        App.account = res;
        App.contracts.Election.deployed().then(function(instance) {
          electionInstance = instance;
          return electionInstance.candidatesCount();
        }).then(function(candidatesCount) {
          var candidatesResults = $("#candidatesResults");
          candidatesResults.empty();

          var candidatesSelect = $('#candidatesSelect');
          candidatesSelect.empty();

          for (var i = 1; i <= candidatesCount; i++) {
            electionInstance.candidates(i).then(function(candidate) {
              var id = candidate[0];
              var name = candidate[1];
              var voteCount = candidate[2];

              // Render candidate Result
              var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
              candidatesResults.append(candidateTemplate);

              var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
            candidatesSelect.append(candidateOption);
            });
          }
          return electionInstance.voters(res);
        }).then(function(hasVoted) {
          // Do not allow a user to voted
          if (hasVoted) {
            //$('form').hide();
            $("#formVote").hide();
            }
        else {
          $("#formVote").show();
            }
          loader.hide();
          content.show();
        }).catch(function(error) {
          console.warn(error);
        });
      }
});


  },


  addCandidate: function() {

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
