
<div class="container">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			<div class="panel panel-default">
				<div class="panel-heading"></div>
				 <div class="alert alert-success" id="message" style="display:none;">
                            
                        </div>
				<div class="panel-body">
					<form class="form-horizontal" method="POST" id="changePasswordForm" >
						 <form  role="form" method="POST" action="apiController@resetPassword" onsubmit="return validate();">
                         {!! csrf_field() !!}
						 
						 <div class="form-group">
                            <label for="email" class="col-md-4 control-label">Password:</label>

                            <div class="col-md-6">
							<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								    <input type="password" name="password" id="password" value="" class="form-control" />
								</div>

                                 </div>
                        </div>
						
						<div class="form-group">
                            <label for="email" class="col-md-4 control-label">Confirm Password:</label>

                            <div class="col-md-6">
			                <div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock fa-lg" aria-hidden="true"></i></span>
								    <input type="password" class="form-control" name="con_password" id="con_password" />
							</div>

                                 </div>
                        </div>
						 
						 <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                            <input type="hidden" class="input" name="email" value="<?=$email?>" />
                           
                            <button type="button"  value="" name="form" class="btn btn-primary" onclick="co_password();">Submit</button>
							</div>
							</div>
                      </form>
				</div>
			</div>
		</div>
	</div>
</div>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script>
function validate()
{
	conf_password = co_password();
	if(conf_password == false)
	{
		return false;
	}
}

function co_password()
{
	
	pswd = $('#password').val();
	c_pswd = $('#con_password').val();
	
	if(pswd != c_pswd)
	{
		alert("Password does not match");
		return false;
	}
	else
	{
		
		$.ajax ({
			url: "../changePassword",
			dataType: 'json',
			async: false,
			method: 'POST',
			data : $('#changePasswordForm').serialize(),
			success: function (response) {
				if(response.status == 1){
					$('#message').show();
					$('#message').html('Password has been update.');
					
				  }
				 
				 }
				});
	}
}
</script>

