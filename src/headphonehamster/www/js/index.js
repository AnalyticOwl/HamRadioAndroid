
$(document).ready(function () {
    SaveLocal("rest","http://testingserver.net/audio/api");
    $(document).bind("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
    });
    try {
        if (GetLocal("Rm_chkBox")== "true"){
            $("#RememberMe").prop('checked',true);
             var savedEmail= GetLocal('User_Email');
             var savedPwd= GetLocal('User_pwd');
             if(savedEmail){
                 $('#Get_User_email').val(savedEmail);
                 $('#Get_User_pwd').val(savedPwd);
             }       
        }
    } catch (exception) {
        elog(exception);
    }
      // M.Adeeb 27-Feb   startTag

      $("#Regbtn").on('click', function () {
        User_SignUp();
    });

    $("#loginbtn").on('click', function () {
        User_SignIn();
    });

    $("#RememberMe").on('click', function(){
    
        if ($("#RememberMe").prop('checked') == true){
            SaveLocal("Rm_chkBox","true");
        }else{
            SaveLocal("Rm_chkBox","false");
        }
   
    });
    $(document).on('click', '#tap_signup', function() {      
            $('.footer_text').show();
    })
    $(document).on('click', '#tap_signin', function() {
            $('.footer_text').hide();
    })

});

function User_SignUp() {

    var user_name_val = $("#Reg_User_name").val();
    var user_email_val = $("#Reg_User_Email").val();
    var user_pwd_val = $("#Reg_User_pwd").val();

    var Reg_text = '{"username": "' + user_name_val + '","email": "' + user_email_val + '","password": "' + user_pwd_val + '"}';

    var Reg_URL = 'http://testingserver.net/audio/api/registeruser';
    var Data = JSON.stringify(JSON.parse(Reg_text));
    var Reg_out_val = PostAjax(Reg_URL, Data);

    Reg_out_val.done(function (resultData) {
        log(resultData);
        msg('Your email has been register in our system. An email has been sent in you inbox. Please follow instructions.');
        log("Reg Done");
    });
}

function User_SignIn() {

    var user_email = $("#Get_User_email").val();
    var user_pwd = $("#Get_User_pwd").val();

    var Login_text = '{"email": "' + user_email + '","password": "' + user_pwd + '"}';

    var login_URL = 'http://testingserver.net/audio/api/loginuser';
    var Data = JSON.stringify(JSON.parse(Login_text));
    var login_out_val = PostAjax(login_URL, Data);
    try {
        login_out_val.done(function (resultData) {
            var jsonData = JSON.parse(resultData);
            log(jsonData);
            log(jsonData.status);

            if (jsonData.status == "success") {
                SaveLocal("User_Id", jsonData.data[0].id);
                SaveLocal("User_Email", jsonData.data[0].email);                
                SaveLocal("User_pwd", user_pwd);
                gotoPage("main.html");               
                getAllPlaylist();

            } else {
                msg('Invalid email or password');
                SaveLocal("User_Id", null);
            }

            log(GetLocal("User_Id"));

            log("Done");
        });
    }
    catch (exception) {
        elog(exception);
    }
}
    // Adeeb EndTag
    // onclick frofile sending
     //GetAllEqualizerProfiles();
    // when equilizer Profile is selected
    // $('#ddlEqProfile').on('change', function () {
    //     log('eqSelector changed');

    //     try {
    //         log("Profile request Start");
    //         // get id and name and request data
    //         var selectedEqOptionId = $('#ddlEqProfile').val();
    //         var selectedEqOptionName = $('select option[value="' + selectedEqOptionId + '"]').text();

    //         var ProfileData = GetEqualizerProfileByName(selectedEqOptionName);
    //         var key_valuesPair = "";
    //         // get response string convert to json
    //         ProfileData.done(function (resultData) {

    //             var profileBand = resultData.profile[0].band;
    //             profileBand = profileBand.split(',');

    //             for (var index = 0; index < profileBand.length - 1; index++) {
    //                 key_valuesPair += '"' + profileBand[index].replace(':', '":"') + '",';
    //             }

    //             key_valuesPair = '{' + key_valuesPair + '}';
    //             key_valuesPair = key_valuesPair.replace(',}', '}');
    //             var finalJson = JSON.parse(key_valuesPair);
    //             // set received finalized json to inputs
    //             SetEqJson(finalJson);

    //         })
    //             .done(function () {
    //                 //$('.eqStyle').trigger('change');
    //                 $('.eqStyle').click();

    //             })
    //             .fail(function (resultdata) {
    //                 jlog(resultdata);
    //             });
    //     } catch (exception) {
    //         elog(exception);
    //     }
    // });

   


  /*  var songsarray = [];
    //var index = 0;
 $('input:checkbox').change(function (eve) {
        songsarray = [];
    $("#play-list").children().remove();

    $('input:checked').each(function (index) {

        console.log(index);
        var select = $(this).parents("#gotoparent");

        var arrayofsongs = select.parent('li').clone();
        songsarray[index] = arrayofsongs;

        console.log(songsarray[index]);
    });
});*/
