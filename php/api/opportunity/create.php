<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/opportunity.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$opportunity = new Opportunity($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  $opportunity->OpportunityID = $data->OpportunityID;
  $opportunity->ClosingDate =$data->ClosingDate;
  $opportunity->ScoringCategoryBlob = $data->ScoringCategoryBlob;
  $opportunity->LeadEvaluatorID = $data->LeadEvaluatorID;
  $opportunity->Name = $data->Name;
  $opportunity->LowestBid = $data->LowestBid;
  $opportunity->Description = $data->Description;

  if($opportunity->create())
  {
    echo '{';
       echo ' message : "Create suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Create failed."';
    echo '}';
  }
}
else
{
  // get bidderID from POST
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["opportunityid"]))
  {
    $opportunityID = $_POST_LowerCase["opportunityid"];

    //Search
    $opportunity->OpportunityID = $opportunityID;

    if(isSet($_POST_LowerCase["closingdate"]))
    {
      $ClosingDate = $_POST_LowerCase["closingdate"];
      $ClosingDate = htmlspecialchars(strip_tags($ClosingDate));
      $opportunity->ClosingDate =$ClosingDate;
    }

    if(isSet($_POST_LowerCase["scoringcategoryblob"]))
    {
      $ScoringCategoryBlob = $_POST_LowerCase["scoringcategoryblob"];
      $ScoringCategoryBlob = htmlspecialchars(strip_tags($ScoringCategoryBlob));
      $opportunity->ScoringCategoryBlob = $ScoringCategoryBlob;
    }

    if(isSet($_POST_LowerCase["leadevaluatorid"]))
    {
      $LeadEvaluatorID = $_POST_LowerCase["leadevaluatorid"];
      $LeadEvaluatorID = htmlspecialchars(strip_tags($LeadEvaluatorID));
      $opportunity->LeadEvaluatorID = $LeadEvaluatorID;
    }

    if(isSet($_POST_LowerCase["name"]))
    {
      $Name = $_POST_LowerCase["name"];
      $Name = htmlspecialchars(strip_tags($Name));
      $opportunity->Name = $Name;
    }

    if(isSet($_POST_LowerCase["lowestbid"]))
    {
      $LowestBid = $_POST_LowerCase["lowestbid"];
      $LowestBid = htmlspecialchars(strip_tags($LowestBid));
      $opportunity->LowestBid = $LowestBid;
    }

    if(isSet($_POST_LowerCase["description"]))
    {
      $Description = $_POST_LowerCase["description"];
      $Description = htmlspecialchars(strip_tags($Description));
      $opportunity->Description = $Description;
    }

    if($opportunity->create())
    {
      echo '{';
      echo ' message : "Create suceeded.  Record(OpportunityID='.$opportunityID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Create failed.  Record(OpportunityID='.$opportunityID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "Create failed.  Parameter Missing (OpportunityID)."';
    echo '}';
  }
}
?>
