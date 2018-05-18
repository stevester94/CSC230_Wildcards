//On Start
var opportunityID = localStorage.getItem("opportunityID");
//var proposalID = localStorage.getItem("proposalId");
var totalPossiblePoints;
var lowestFeeProposal;

$(document).ready(
    function () {
        var oppName = localStorage.getItem("opportunityName");
        getProposalListWithFee();
        document.getElementById("oppName").innerHTML = oppName;
        $('#proposalListTable tr').click(function() {
            showOpp();
        });
    });

function GetTotalPossiblePoints(){
    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            totalPossiblePoints = jsonArray.TotalPoints;
        } else {
            alert("Error getting total possible points");
        }
    };
    xhr.send();
}

//get proposal list based on opportunity id
function getProposalListWithFee() {
    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET',' http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?Status=65&OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillProposalFeeTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill proposal Fee table and pagination logic
function fillProposalFeeTable(jsonArray){
    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.proposal.length;
    fillOppTable(start, limit);

    function fillOppTable(start, limit){
        for(var i=start;i<limit;i++) {
            var proposal = jsonArray.proposal[i];
            var row ="<tr>"+"</td><td>"+ proposal.BidderName + "<td>" +  proposal.ProposalID + "</a></td><td>"
                +proposal.FinalTotalScore + "<td>" +  proposal.FinalTotalScore + "<td>" +  "<button onclick='enterProposersFee(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-primary btn-sm'>" +
                "<span class='glyphicon glyphicon-triangle-right'></span>Reveal Proposer's Fee</button><td>" + "<button onclick='awardContract(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-accept btn-sm'>" +
                "<span class='glyphicon glyphicon-ok-sign'></span>Award Contract</button></td>";

            $('#proposalListFeeTableBody').append(row);
            $("#proposalListFeeTableBody").trigger("update");
        }
    }
    //next
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#proposalListFeeTableBody').empty();
            console.log(next +' -next- '+limit);
            fillOppTable(next,limit);
        }
    });
//prev
    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            console.log(pre +' -pre- '+limit);
            $('#proposalListFeeTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

//TODO calculate final scores for all proposals and dynamically populate the table
function CalculateFinalScore(){
    //get an end point to check in db if proposer's fee for all proposers is entered, if entered get the lowest proposal
    lowestFeeProposal = document.getElementById("lowestFee").value;

    if(lowestFeeProposal != null){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',' http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?Status=65&OpportunityID='+opportunityID,true);
        xhr.onload = function() {
            if (xhr.status == 200) {
                var jsonArray = JSON.parse(xhr.responseText);
                calculateEachProposerFee(jsonArray);
                //after updating all fee rows repopulate
                getProposalListWithFee();
            } else {
                alert("Error response");
            }
        };
        xhr.send();
    }
}

function calculateEachProposerFee(jsonArray) {
    for (var i = 0; i <= jsonArray.proposal.length; i++) {
        var proposersFee = jsonArray.proposal[i].proposersFee;

        if (proposerFee < 1) {
            alert("invalid Proposers Fee value!");
        }
        else {
            var finalScore = (lowestFeeProposal / proposersFee) * totalPossiblePoints;
            document.getElementById("feeProposalScore").innerHTML = feeProposalScore;
            updateProposalTotalScore(jsonArray.proposal[i].ProposalID, finalScore);
        }
    }
}

//Update final proposal score
    function updateProposalTotalScore(proposalID, feeProposalScore) {
        var updateProposalScore = {"ProposalID": proposalID, "FinalTotalScore": feeProposalScore};

        var updateProposal = JSON.stringify(updateProposalScore);
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php", true);
        xhttp.onload = function () {
            if (xhttp.status == 200) {
                alert("Proposal Score updated!")
            } else {
                alert("Error seeking clarification!")
            }
        }
        xhttp.send(updateProposal);
    }

//Enter proposer's fee
//TODO update proposers fee in the table
function enterProposersFee(proposalID){
    localStorage.setItem("proposalID",proposalID);
    window.location.replace("enter_proposers_fee.html")
}