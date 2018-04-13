$(document).ready(function () {
    SaveLocal("rest", "http://testingserver.net/audio/api");
    SaveLocal("User_Id", null);
    SaveSession("User_status", null);
    $("#signoutId").hide();
    $("#signinId").show();
    $(document).bind("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
    });
    try {
        if (GetLocal("Rm_chkBox") == "true") {
            $("#RememberMe").prop('checked', true);
            var savedEmail = GetLocal('User_Email');
            var savedPwd = GetLocal('User_pwd');
            if (savedEmail) {
                $('#Get_User_email').val(savedEmail);
                $('#Get_User_pwd').val(savedPwd);
            }
        }
    } catch (exception) {
        elog(exception);
    }
   
    $("#Regbtn").on('click', function () {
        User_SignUp();
    });
    $("#loginbtn").on('click', function () {
        User_SignIn();
    });
    $("#RememberMe").on('click', function () {
        if ($("#RememberMe").prop('checked') == true) {
            SaveLocal("Rm_chkBox", "true");
        } else {
            SaveLocal("Rm_chkBox", "false");
        }
    });
    $(document).on('click', '#tap_signup', function () {
        $('.footer_text').show();
    })
    $(document).on('click', '#tap_signin', function () {
        $('.footer_text').hide();
    });
    $(document).on('click', '#signoutId', function () {
        User_Signout();
    });
});
function User_SignUp() {
    var user_name_val = $("#Reg_User_name").val();
    var user_email_val = $("#Reg_User_Email").val();
    var user_pwd_val = $("#Reg_User_pwd").val();
    var Reg_text = '{"username": "' + user_name_val + '","email": "' + user_email_val + '","password": "' + user_pwd_val + '"}';
    var Reg_URL = 'http://testingserver.net/audio/api/registeruser';
    var Data = JSON.stringify(JSON.parse(Reg_text));
    if (checkConnection()) {
        var Reg_out_val = PostAjax(Reg_URL, Data);
        Reg_out_val.done(function (resultData) {
            log(resultData);
            msg('Your email has been register in our system. An email has been sent in you inbox. Please follow instructions.');
            log("Reg Done");
        });
    } else {
        msg("No internet connection");
    }
}
function User_SignIn() {
    var user_email = $("#Get_User_email").val();
    var user_pwd = $("#Get_User_pwd").val();
    var Login_text = '{"email": "' + user_email + '","password": "' + user_pwd + '"}';
    var login_URL = 'http://testingserver.net/audio/api/loginuser';
    var Data = JSON.stringify(JSON.parse(Login_text));
    if (checkConnection()) {
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
                    SaveSession("User_status", jsonData.status);

                    $("#email_address").html(jsonData.data[0].email);
                    $("#Username").html(jsonData.data[0].username);

                    $("#signoutId").show();
                    $("#signinId").hide();
                    gotoPage("main");
                   // $("#equalizer_profile").click();
                    GetAllEqualizerProfiles();
                    sending_to_server();
                } else {
                    msg('Invalid email or password');
                    SaveLocal("User_Id", null);
                    SaveSession("User_status", null);
                }
                log(GetLocal("User_Id"));
                log(GetSession("User_status"));
                log("Done");
            });
        }

        catch (exception) {
            elog(exception);
        }
    } else {
        msg("No internet connection");
    }
}
function User_Signout() {
    $("#signoutId").hide();
    $("#signinId").show();
    SaveSession("User_status", null);
    $("#panelLink").panel("close");
    gotoPage("main");
    $("#backTomain").click();
    $("#email_address").html("Email Address");
    $("#Username").html("Username");
}

$(document).on('click', '#forget_Password', function () {
    try {
        var user_email = $("#Get_User_email").val();
        if (user_email != 0) {
            var email_change_data = '{"email":"' + user_email + '"}';
            var Url = 'http://testingserver.net/audio/api/forgetpassword';
            var api_data = JSON.stringify(JSON.parse(email_change_data));           
                var api_link = PostAjax(Url, api_data);
                api_link.done(function (result) {
                    log(result);
                    msg('We have sent an email to Your Email Address.Click the link in  the email to reset your password');
                    log('Forget Email Send');
                });
           }else {
            msg('Please Enter your Email');
        }
    }
    catch (exception) {
        elog(exception)
    }
});
$(document).on('click',"#changepwd", function () {
    if (checkConnection()) {
        if (GetSession("User_status") == "success") {
            var forget_data = '{"email":"' + GetLocal("User_Email") + '"}';
            var Url = 'http://testingserver.net/audio/api/forgetpassword';
            var forget_Data = JSON.stringify(JSON.parse(forget_data));
            var promisDone = PostAjax(Url, forget_Data);
            promisDone.done(function (result) {
                msg('We have sent an email to Your Email Address.Click the link in  the email to change your password');
                log(result);
                log(" forget Password ");
            });
        } else {
            msg("Please Sign In");
            $("#panelLink").panel("open");
        }
    } else {
        msg("No internet connection");
    }
});

// SaveSession("shuffle", "off");
// SaveSession("repeat", "off");
// SaveSession("mainPath", dirURL);
// SaveSession("currDirName",currDir);
// SaveSession("currDirLen",dir_counter);
// SaveSession("currDirSonglen",song_counter);
// SaveSession("song_ID", song_ID);
// SaveSession("playlist_ID", playlistID);
// SaveSession("curr_profile_ID", profileID);
// SaveSession("SongURL", current_song);
// SaveSession("songName", tags.title.replace(/\s+/g, '_'));
// SaveSession("currPLName",playlist_name);
// SaveSession("currPLlen",song_len);
// SaveSession("profileId", _Profile_id.toString());
// SaveSession("User_status", jsonData.status);
// SaveSession("User_status", null);

// SaveLocal("User_Id", jsonData.data[0].id);
// SaveLocal("User_Email", jsonData.data[0].email);
// SaveLocal("User_pwd", user_pwd);
// SaveLocal("rest", "http://testingserver.net/audio/api");
// SaveLocal("Rm_chkBox", "true");