function BidderLoginAction(form) {
    //Check to see if user left username or password field blank
    if (form.username.value == "") {
        alert("Please enter user name")
    }
    else if (form.password.value == "") {
        alert("Please enter your password ")
    }
    else{
        //read username and password from the HTML form
        var params = {"UserName":form.username.value,
                    "PASSWORD":form.password.value};

        //Convert HTML form value to json
        var myJSON = JSON.stringify(params);
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "http://athena.ecs.csus.edu/~mackeys/php/api/bidder/authentication.php", false);
        //Async call

        xhttp.onload = function () {
            var response = JSON.parse(xhttp.responseText);
            var status = JSON.parse(xhttp.status);
            if (status == 200 && response.authenticated == true) {
               //window.location.replace("https://www.google.com")
                alert("Login Successful!!")
            }
            else{
                alert("Incorrect username or password ")
            }
        }
        //Send POST request to server
        xhttp.send(myJSON);
    }
}