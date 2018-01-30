	$(document).bind("mobileinit", function() {
		    $.support.cors = true;
		    $.mobile.allowCrossDomainPages = true;
		});

$(document).ready(function(){	   
	 songurl = "js/songs/song1.mp3";
	 songur2 = "js/songs/song2.mp3";
	 songur3 = "js/songs/song3.mp3";
 });
 
/*function playsong(songid,songur,trackname){*/
function playsong(songur){
alert(songurl);
	 trackname = "Test Track";
	 
	 footershow();

	    $("#playTrackName").html(trackname);
		$(".NowPlayTrackName").html(trackname);
	 $("#jquery_jplayer_1").jPlayer("destroy");
	apply_song_url = songur;

           
			var myCirclePlayer = new CirclePlayer("#jquery_jplayer_1",
		{
			m4a: apply_song_url,
		//	m4a: "http://104.37.191.141/4234343/cards/mp3/previews/A2XXQF3PFUbJDmuTXnrXXUxLV45UaGoq.mp3",
		//	oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
		}, {
			cssSelectorAncestor: "#cp_container_1",
			swfPath: "../../dist/jplayer",
			wmode: "window",
			keyEnabled: true,
			timeFormat: {
            showHour  : true
        },
			canplay: function() {
    $("#jquery_jplayer_1").jPlayer("play");
    }
		}); 
		
		$("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) { 
        var tDuration = Math.floor(event.jPlayer.status.duration);
		var currentTime = Math.floor(event.jPlayer.status.currentTime);
		var NowPlaying = event.jPlayer.status.paused;
		/* if(NowPlaying=="true"){
		   $(".footer_ganaric").css("display","block");	
		 } else{
			  alert("SPaused"+SPaused);
			 }*/

		var s=tDuration-currentTime;
	      var h = Math.floor(s/3600); s -= h*3600; 
	      var m = Math.floor(s/60); 
              s -= m*60;
          var remainTime= (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
		  var ss=currentTime;
	      var hh = Math.floor(ss/3600); ss -= hh*3600; 
	      var mm = Math.floor(ss/60); 
              ss -= mm*60;
          var preTime= (mm < 10 ? '0'+mm : mm)+":"+(ss < 10 ? '0'+ss : ss);
		  
 	     
           $(".NowPlayTimeBar").html(preTime+" / "+remainTime);
		   
    });
		if($("#jquery_jplayer_1").data("jPlayer").status.currentTime == "5") {
			// alert("hello"); 
			 }
}

function NowPlayClose(){
	$(".footer_ganaric").css("display","none");	
          $.jPlayer.pause();
	}
	
function PlayerPause(){
	$.jPlayer.pause();
	var changePPButton='<a href="#" onClick="PlayerPlay();"><img src="image/android/SAPlayControl.png" width="auto;"> </a>';
	$(".NowPlayPause").html(changePPButton);

}

function PlayerPlay(){
	$("#jquery_jplayer_1").jPlayer("play",12);
var changePPButton='<a href="#" onClick="PlayerPause();"><img src="image/android/stird-video@2x.png" width="auto;"> </a>';
	$(".NowPlayPause").html(changePPButton);

	
}
	
function footershow(){
	$(".footer_ganaric").css("display","block");	
}
function showmusicpage(){
	$(".footer_ganaric").css("display","block");	
}
	