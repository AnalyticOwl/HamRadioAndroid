$(document).ready(function() {
	getPakageId(1);
	$('#section_two').hide();
	$('#section_three').hide();
	$('#section_four').hide();
	$('#section_five').hide();	
	$('#section_six').hide(); 
	$('#payment_section').hide();	 
	
    $('#step_one').click(function() {
	   	valid_email = $("#email").val();
		username = $("#username").val();
		confirm_email = $("#confirm_email").val();
		email_status = ifEamilExists(valid_email);
		email_confirm = isSameEmail(confirm_email);
		username_status = ifUsernameExists(username);
		//valid_confirm_email = $("#valid_confirm_email").text();
		if(email_status == 'true' && username_status == 'true' && email_confirm == true)
		{
			$('#section_one').hide();
			$('#section_two').show();
		}
	   	
	});
	$('#back_step_two').click(function() {
		$('#section_two').hide();
		$('#section_one').show();
	});
	$('#step_two').click(function() {
		 status = validate_input();
		 if(status != 'false')
		 {
			$('#section_two').hide();
			$('#section_three').show();
		 }
	});
	
	$('#back_step_three').click(function() {
		$('#section_three').hide();
		$('#section_two').show();
	});
	$('#step_three').click(function() {
		$('#section_three').hide();
		$('#section_four').show();
	});
	$('#step_four').click(function() {
		var domain_name = $("#subdomain").val();
		var terms_and_conditions = $('#terms_and_conditions').prop('checked');
		
		if(terms_and_conditions == false)
		{
			$("#term_error").show();
			$("#term_error").text("You must agree to the Terms of Service in order to signup");
			$("#term_error").css("color", "red");
		}
		else
		{
			$("#term_error").hide();
			$("#term_error").text("");
		}
		status = ifDomainExists(domain_name);
		if(status == 'true' && terms_and_conditions == true)
		{
			$('#section_four').hide();
			$('#section_five').show();
		}
	});
	$('#back_step_four').click(function() {
		$('#section_four').hide();
		$('#section_three').show();
	});
	
	$('#back_step_five').click(function() {
		$('#section_four').show();
		$('#section_five').hide();
	});
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function checkUserEmail() {
  var email = $("#email").val();
  if (validateEmail(email)) {
	  $("#valid_email").hide();
	  $("#valid_email").text("");
	  return true;
  } else {
	$("#valid_email").show();
    $("#valid_email").text("Please enter a valid email address");
    $("#valid_email").css("color", "red");
	return false;
  } 
}
function checkUserConfirmEmail() {
  var email = $("#confirm_email").val();
  if (validateEmail(email)) {
	  $("#valid_confirm_email").hide();
	  $("#valid_confirm_email").text("");
	  if(isSameEmail() == false){
		  return false;
	  }
	  return true;
  } else {
	$("#valid_confirm_email").show();
    $("#valid_confirm_email").text("Please enter a valid email address");
    $("#valid_confirm_email").css("color", "red");
	return false;
  } 
}
function checkUserName() {
  var username = $("#username").val();
  if (username != '') {
	  $("#username_error").hide();
	  $("#username_error").text("");
	  return true;
  } else {
	$("#username_error").show();
    $("#username_error").text("Please enter username");
    $("#username_error").css("color", "red");
	return false;
  } 
}
function isSameEmail()
{
	 var email = $("#email").val();
	 var confirm_email = $("#confirm_email").val();
	 if(email == confirm_email){
		 $("#valid_confirm_email").hide();
		 $("#valid_confirm_email").text("");
		 return true;
	 }
	 else {
		$("#valid_confirm_email").show();
		$("#valid_confirm_email").text("Please enter same email addresss");
		$("#valid_confirm_email").css("color", "red");
		returnValue = 'false';
		return false;
	 }
}
function ifEamilExists(email)
{
	var returnValue = '';
	if(checkUserEmail() == true) {
	$.ajax ({
			url: "check-user-email",
			dataType: 'json',
			async: false,
			data : {
				'_token': $('meta[name="csrf-token"]').attr('content'),
				email :  email
			},
			success: function (response) {
					if (response.status == 1) {
						$("#valid_email").show();
						$("#valid_email").text("Email already exist.");
						$("#valid_email").css("color", "red");
						returnValue = 'false';
						return false;
					}else if (response.status == 0) {
						$("#valid_email").hide();
						$("#valid_email").text("");
						returnValue = 'true';
						return true;
					}
				 }
		 });
		 
	}
	return returnValue;
}
function ifUsernameExists(username)
{
	var returnValue = '';
	if(checkUserName() == true) {
	$.ajax ({
			url: "check_user",
			dataType: 'json',
			async: false,
			method: 'POST',
			data : {
				'_token': $('meta[name="csrf-token"]').attr('content'),
				username :  username
			},
			success: function (response) {
					if (response.status == 1) {
						$("#username_error").show();
						$("#username_error").text("Username already exist.");
						$("#username_error").css("color", "red");
						returnValue = 'false';
						return false;
					}else if (response.status == 0) {
						$("#username_error").hide();
						$("#username_error").text('');
						returnValue = 'true';
						return true;
						
					}
				 }
		 });
	}
	return returnValue;
}
function validate_input()
{
	first_name = $('#first_name').val();
	if(first_name == '')
	{
		$("#first_name_error").show();
		$("#first_name_error").text("Please enter first name.");
		$("#first_name_error").css("color", "red");
		return false;
	}
	else
	{
		$("#first_name_error").hide();
		$("#first_name_error").text("");
	}
	last_name = $('#last_name').val();
	if(last_name == '')
	{
		$("#last_name_error").show();
		$("#last_name_error").text("Please enter last name.");
		$("#last_name_error").css("color", "red");
		return false;
	}
	else
	{
		$("#last_name_error").hide();
		$("#last_name_error").text("");
	}
	address = $('#address').val();
	if(address == '')
	{
		$("#address_error").show();
		$("#address_error").text("Please enter street address.");
		$("#address_error").css("color", "red");
		return false;
	}
	else
	{
		$("#address_error").hide();
		$("#address_error").text("");
	}
	city = $('#city').val();
	if(city == '')
	{
		$("#city_error").show();
		$("#city_error").text("Please enter city name.");
		$("#city_error").css("color", "red");
		return false;
	}
	else
	{
		$("#city_error").hide();
		$("#city_error").text("");
	}
	city = $('#city').val();
	if(city == '')
	{
		$("#city_error").show();
		$("#city_error").text("Please enter city name.");
		$("#city_error").css("color", "red");
		return false;
	}
	else
	{
		$("#city_error").hide();
		$("#city_error").text("");
	}
	country = $('#country').val();
	if(country == '')
	{
		$("#country_error").show();
		$("#country_error").text("Please select country.");
		$("#country_error").css("color", "red");
		return false;
	}
	else
	{
		$("#country_error").hide();
		$("#country_error").text("");
	}
	phone = $('#phone').val();
	if(phone == '')
	{
		$("#phone_error").show();
		$("#phone_error").text("Please enter phone number.");
		$("#phone_error").css("color", "red");
		return false;
	}
	else
	{
		status = isNumber(phone);
		if(status == 'false')
		{	
			$("#phone_error").show();
			$("#phone_error").text("Please enter valid phone number.");
			$("#phone_error").css("color", "red");
			return false;
		}
		
		$("#phone_error").hide();
		$("#phone_error").text("");
	}
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function getPrices(plan)
{	
	$.ajax ({
			
			url: "get-prices",
			method: 'POST',
			dataType: 'json',
			async: false,
			
			data : {
				'_token': $('meta[name="csrf-token"]').attr('content'),
				plan :  plan
			},
			success: function (response) {
				var input = response.data[0].price.toString();
				var price_1 = input.split('.');
				var input = response.data[1].price.toString();
				var price_2 = input.split('.');
				var input = response.data[2].price.toString();
				var price_3 = input.split('.');
				var input = response.data[3].price.toString();
				var price_4 = input.split('.');
				
				$('#price_1').html("<strong>$"+price_1[0]+".</strong><sup>"+price_1[1]+"</sup><br />per month</p>");
				$('#price_2').html("<strong>$"+price_2[0]+".</strong><sup>"+price_2[1]+"</sup><br />per month</p>");
				$('#price_3').html("<strong>$"+price_3[0]+".</strong><sup>"+price_3[1]+"</sup><br />per month</p>");
				$('#price_4').html("<strong>$"+price_4[0]+".</strong><sup>"+price_4[1]+"</sup><br />per month</p>");
				//console.log(response);console.log(response.data[0].price);
			}
		 });
}

function getPakageId(package_id)
{
	//$("#list_group_"+package_id).addClass('active');
	$("#package_selected").val(package_id);
	var base_url = $("#base_url").val();
	$.ajax ({
			url: "get-themes-list",
			dataType: 'json',
			async: false,
			method: 'POST',
			data : {
				'_token': $('meta[name="csrf-token"]').attr('content'),
				package_id :  package_id
			},
			success: function (response) {
					var html = '';
					$("#theme_selected").val(response[0].theme_id);
					for(var i = 0; i < response.length; i++)
					{
						var string = '<div id='+response[i].theme_id+' style="float: left; margin-right: 20px;">';
							string += '<h5>'+response[i].theme_name+'</h5>';
							string += '<div>';
							string += '<a href="javascript:" onClick="store_theme_id('+response[i].theme_id+')">';
							string += '<img src='+base_url+'/assets/theme_images/'+response[i].theme_image+' width=200px;>';
							string += '</a>';
							string += '</div>';
							string += '</div>';
							html   += string;
					}
					$("#themes").html(html);
				 }
	 });
}
function checkDomain() {
  var subdomain = $("#subdomain").val();
  if (subdomain != '') {
	  $("#domain_error").hide();
	  $("#domain_error").text("");
	  return true;
  } else {
	$("#domain_error").show();
    $("#domain_error").text("Please enter site name.");
    $("#domain_error").css("color", "red");
	return false;
  } 
}
function ifDomainExists(domain_name)
{
	var returnValue = '';
	if(checkDomain() == true)
	{
		
	$.ajax ({
			url: "check-domain-availabilty",
			method: 'POST',
			dataType: 'json',
			async: false,
			
			data : {
				'_token': $('meta[name="csrf-token"]').attr('content'),
				domain_name :  domain_name
			},
			success: function (response) {
				if(response.status == 0){
					$("#domain_error").hide();
					$("#domain_error").text("");
					returnValue = 'true';
				}else if(response.status == 1){
					$("#domain_error").show();
					$("#domain_error").text("Domain already exist.");
					$("#domain_error").css("color", "red");
					returnValue = 'false';
				}
				
			}
		 });
	}
	return returnValue;
}
function store_theme_id(theme_id)
{
	$("#theme_selected").val(theme_id);
}
function reserveSite()
{
	$('#reserve_site').attr("disabled", true);
	$.ajax ({
			url: "reserve-site",
			dataType: 'json',
			async: false,
			method: 'POST',
			data : $('#get_started').serialize(),
			success: function (response) {
				if(response.status == 1)
					$('#section_five').hide();
					$('#payment_section').show();
				 }
	 });
}