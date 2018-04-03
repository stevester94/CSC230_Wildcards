$(document).ready(
    function () {
        initNewOppForm();
        $('#editOppPanel').hide();
        $('#newOppPanel').hide();
        $('.datepicker').datepicker();
        $('#listOppPanel').show();

        $('#manageOpp').click(function() {
            getOppList();

            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });

        $('#showNewOpp').click(function (){
            $('#newOppPanel').show();
            $('#listOppPanel').hide();
        });

        $('#exitNewOpp').click(function() {
            $('#newOppPanel').hide();
            $('#newOppForm')[0].reset();
            $("#listOppPanel").show();
        });

        $('#clearNewOpp').click(function() {
            $('#newOppForm')[0].reset();
        });

        $('#oppListTable tr').click(function() {
            showOpp();
        });

        $('.oppListButton').click(function(){
            showOppList();
        });

        $('#editOppButton').click(function() {
            showEditOpp();
        });

        $('#exitNewOpp').click(function() {
            $('#newOppPanel').hide();
        });

    });

function showEditOpp() {
    $('#listOppPanel').hide();
    $('#newOppPanel').hide();
    $('#editOppPanel').show();
};

function showOppList() {
    $('#listOppPanel').show();
};

function getOppList() {

    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillOppTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//TODO Logic for pagination
function fillOppTable(jsonArray){

    var start = 0;
    var elements_per_page = 4;
    var limit = elements_per_page;
    var size = jsonArray.opportunity.length;
    fillOppTable(start, size);

    function fillOppTable(start, limit){
        for(var i=start;i<limit;i++) {
            fillOppTable(jsonArray);
            var opp = jsonArray.opportunity[i];
            var row ="<tr>"+"</td><td>" + opp.OpportunityID+ "</td><td>" + "<a href='javascript:showOpp()'>" +  opp.Name + "</a></td><td>"
                +  opp.Status + " </td>";
            $('#oppListTableBody').append(row);
            $("#oppListTableBody").trigger("update");
        }
    }
    $('#nextValue').click(function(){

        var next = limit;
        if(max_size>=next) {
            limit = limit + elements_per_page;
            $('#oppListTableBody').empty();
            console.log(next +' -next- '+limit);
            fillOppTable(next,limit);
        }
    });

    $('#PreValue').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            console.log(pre +' -pre- '+limit);
            $('#oppListTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}


function initNewOppForm() {
    getOppList();
}

function showOpp() {
    window.location.replace("Opportunity_new.html")
}
