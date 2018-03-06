$(document).ready(function(){

try {
    if(true){
        var savedEmail= GetLocal('User_Email');
        if(savedEmail){
            $('#Get_User_email').val(savedEmail);
        }       
    }
} catch (exception) {
    elog(exception);
}

});