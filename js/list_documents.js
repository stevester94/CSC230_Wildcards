//proposal id passes from the previous page where a specific proposal is selected
var proposalID = localStorage.getItem("proposalId");

//onstart?
$(document).ready(
    function () {
        getDocumentList();
        $('#manageOpp').click(function() {
            getDocumentList();
            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });
    });

//Get all Documents for the proposal from server
function getDocumentList() {
    $('#documentsTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/getDocsList.php?proposalid='+proposalID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillDocumentTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill table with all the documents belonging to proposal and pagination logic
function fillDocumentTable(jsonArray){
    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.doc.length;
    fillDocTable(start, limit);

    function fillDocTable(start, limit){
        for(var i=start;i<limit;i++) {
            var doc = jsonArray.doc[i];
            var row = "<tr><td>" + doc.DocTitle+ "</td><td><a class='btn btn-primary btn-sm' href='" + doc.Url  +
                "'><span class='glyphicon glyphicon-circle-arrow-down' aria-hidden='true'></span>   Download</a> ";
            $('#documentsTableBody').append(row);
            $("#documentsTableBody").trigger("update");
        }
    }

    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#documentsTableBody').empty();
            fillOppTable(next,limit);
        }
    });

    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            $('#documentsTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

//Function to update proposal status
//TODO get the right endpoint to use
function updateProposalStatus(status) {
    //status is passed and proposal id is a global variable
    var params = {"ProposalID":proposalID,
        "Status":status};
    var myJson = JSON.stringify(params);
    var xhttp = new XMLHttpRequest();
   // var xhr = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php'",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert('Update successful');
        } else {
            alert('Error updating status');
        }
    }
    xhttp.send(myJson);
}

