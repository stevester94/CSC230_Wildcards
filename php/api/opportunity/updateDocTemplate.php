<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../objects/doctemplate.php';

$database = new Database();
$db = $database->Connect();

// prepare to retrieve bidder data by instantiate the Bidder.
$doctemplate = new DocTemplate($db);

//Check to see if input is in JSON
$data = json_decode(file_get_contents("php://input"));
if(json_last_error() === JSON_ERROR_NONE)
{
  if(isset($data->DocTemplateID) and !is_null($data->DocTemplateID))
    $doctemplate->DocTemplateID = $data->DocTemplateID;

  if(isset($data->DocTitle) and !is_null($data->DocTitle))
    $doctemplate->DocTitle = $data->DocTitle;

  if(isset($data->Path) and !is_null($data->Path))
    $doctemplate->Path = $data->Path;

  if(isset($data->Blob) and !is_null($data->Blob))
    $doctemplate->Blob = $data->Blob; 

  if(isset($data->DisplayTitle) and !is_null($data->DisplayTitle))
    $doctemplate->DisplayTitle = $data->DisplayTitle; 

  if(isset($data->SortOrder) and !is_null($data->SortOrder))
    $doctemplate->SortOrder = $data->SortOrder; 

  if($doctemplate->update())
  {  
    echo '{';
       echo ' message : "Update suceeded. "';
    echo '}';
  }
  else
  {
    echo '{';
       echo ' message : "Update failed."';
    echo '}';
  }
}
// get bidderID from POST
else 
{
  $_POST_LowerCase = array_change_key_case($_POST, CASE_LOWER);
  if(isSet($_POST_LowerCase["doctemplateid"]))
  {
    $doctemplateID = $_POST_LowerCase["doctemplateid"];

    //Search
    $doctemplate->selectByDocTemplateID($doctemplateID);

    if(isSet($_POST_LowerCase["doctitle"]))
    {
      $doctitle = $_POST_LowerCase["doctitle"];
      $doctemplate->DocTitle = $doctitle;
    }

    if(isSet($_POST_LowerCase["path"]))
    {
      $Path = $_POST_LowerCase["path"];
      $Path = htmlspecialchars(strip_tags($Path));
      $doctemplate->Path =$Path;
    }

    if(isSet($_POST_LowerCase["blob"]))
    {
      $blob = $_POST_LowerCase["blob"];
      $blob = htmlspecialchars(strip_tags($blob));
      $doctemplate->Blob = $blob;
    }

    if(isSet($_POST_LowerCase["displaytitle"]))
    {
      $DisplayTitle = $_POST_LowerCase["displaytitle"];
      $DisplayTitle = htmlspecialchars(strip_tags($DisplayTitle));
      $doctemplate->DisplayTitle = $DisplayTitle;
    }

    if(isSet($_POST_LowerCase["sortorder"]))
    {
      $SortOrder = $_POST_LowerCase["sortorder"];
      $SortOrder = htmlspecialchars(strip_tags($SortOrder));
      $doctemplate->SortOrder = $SortOrder;
    }

    if($doctemplate->update())
    {  
      echo '{';
      echo ' message : "Update suceeded.  Record (DoctemplateID='.$doctemplateID.')"';
      echo '}';
    }
    else
    {
      echo '{';
      echo ' message : "Update failed.  Record (DoctemplateID='.$doctemplateID.')"';
      echo '}';
    }
  }
  else
  {
    echo '{';
    echo ' message : "DocTemplate not found.  Record (DoctemplateID='.$doctemplateID.')"';
    echo '}';
  }
}
?>

