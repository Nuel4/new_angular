export class Global {
  //public static BASE_API_ENDPOINT = 'https://productionyeatsehrtest-api.azurewebsites.net/api/v1/';
  //public static FILESTORE_API_ENDPOINT = 'https://productionyeatsehrtest-api.azurewebsites.net/api/v1/';
  //public static BASE_API_ENDPOINT = 'http://localhost:51250/api/v1/';
  // State Subscription Keys
  public static LoggedIn_User = 'LoggedIn.User'
  public static Globel_Direct_Auto_Post = true
  public static Globel_Auto_Allocate = true
  public static ErrorRACouldNotMatchBill = "Error:Could not match bill for this service line. Please allocate payment for this service line manually.";
  public static ErrorRACouldNotMatchInsuranceProvider = "Error:Could not match insurance provider in yeats.";
  public static ErrorRAPreviousPayment = "Error:There was payment applied to this service line previously. Please allocate payment for this service line manually.";
}

