$(document).on('pageshow', function (event, ui) {
    var currentPage = $.mobile.activePage.attr('id');
    if (currentPage == 'main') {
        log(currentPage);
        $('.ui-filterable').hide();
        $('#panelHomeBtn').addClass('pannelcurrentpage');   //high light panel home button
        var tabID = GetSession("tabId");
        $("#"+tabID).click();
        $("#inappSongList").empty();
        // CheckCreateEvent();
        InitWavesurfer();
    }
    else if (currentPage == 'player_page') {
        // HideLoader();
    }
    else if (currentPage == 'pageSonglist') {
        log(currentPage);
        InitWavesurfer();
    }
    else if (currentPage == 'setting') {
        log(currentPage);
        $('#panelSettingsBtn').addClass('pannelcurrentpage');   //high light panel settings button
    }
    else if (currentPage == 'about_app') {
        log(currentPage);
        $('#panelAboutBtn').addClass('pannelcurrentpage');   //high light panel about button
    }
});
$(document).on('pagebeforechange', function (event, ui) {
    // undo highlighted pannel button
    $('.pannelcurrentpage').removeClass('pannelcurrentpage');
});
$(document).on('popupafterclose', '#positionWindow', function (event, ui) {
    $('#panelHomeBtn').addClass('pannelcurrentpage');
});
/* On Ready functions */
$(document).ready(function () {
    SaveSession("shuffle", "off");
    SaveSession("repeat", "off");
    $('#shuffle_on').hide();
    $('#shuffle_off').show();
    $('#repeat_on').hide();
    $('#repeat_off').show();

    window.api = GetLocal("rest");
    window.scanSongs = [];

    jQuery(function () {
        $("#panelLink").enhanceWithin().panel();
    });

    $("#ListProfiles").listview();
    $("#Player_ListProfiles").listview();
    GetAllEqualizerProfiles();

    $(document).on('click', '#signoutId', function () {
        try {
            window.location.replace("index.html");
        }
        catch (exception) {
            elog(exception);
        }
    });
    $(document).on('click', "#nav_songs", function () {
        $('.ui-filterable').hide();
        var thisId=$(this).attr("id");
        SaveSession("tabId",thisId);   
        // $('#SavePlayListbtn').show();
        // $('#search_songs').show();
    });
    $(document).on('click', "#nav_album", function () {
        $('.ui-filterable').hide();
        var thisId=$(this).attr("id");
        SaveSession("tabId",thisId); 
        // $('#SavePlayListbtn').show();
        // $('#search_songs').hide();
    });
    $(document).on('click', "#nav_artist", function () {
        $('.ui-filterable').hide();
        var thisId=$(this).attr("id");
        SaveSession("tabId",thisId); 
        // $('#SavePlayListbtn').show();
        // $('#search_songs').hide();
    });
    $(document).on('click', "#nav_playlist", function () {
        $('.ui-filterable').hide();
        var thisId=$(this).attr("id");
        SaveSession("tabId",thisId); 
        // $('#SavePlayListbtn').hide();
        // $('#search_songs').hide();
        getAllPlaylist();
    });
    $(document).on('click', "#search_songs", function () {
        log(window.scanSongs);
        scanSongsLi(window.scanSongs);
    });
    $(document).on('click', "#curr_playlist", function () {
        $("#listname").html("");
        $("#inappSongList").empty();
        goback();
    });
    $(document).on('click', "#search_bar", function () {
        $('.ui-filterable').toggle();
        // $("#nav_playlist").click();
    });
    $(document).on('click', "#append_playlist", function () {
        upDateplayList();
        log("Append in Play List");
    });
    $(document).on('click', "#profile_back", function () {
        goback();
    });

    $(document).on('click', "#save_playlist", function () {
        var PL_name = $("#playlist_name").val();
        var playlist_select = $('#userpalylist').val();

        if (PL_name == "" && playlist_select == "Select") {
            $('#playlist_name').css({
                'color': 'red',
                'font-size': '15px'
            });
            $('#playlist_name').val(' Enter Play-List Name !');
            $('#playlist_name').on('focus', function () {
                $('#playlist_name').val('');
                $('#playlist_name').removeAttr('style');
            });
        } else if (PL_name == "") {
            upDateplayList();
        } else {
            SavePlayList(PL_name);
        }
        // $("#positionWindow").popup("close");

        $("#playlist_name").val("");
        $("#userpalylist").empty();
        $("#play-list").empty();
        getAllPlaylist();
    });
    $(document).on('click', '#sendEqProfile', function () {
        try {
            //get profile name and json from inputs
            var eqProfileName = $('#eqProfileName').val();
            var eqProfileJson = GetSelectedEqJson();
            // concatinate profile name with profile json value
            var finalizeObject = '{"profile":[{"name":"${eqProfileName}","band":"${JSON.stringify(eqProfileJson)}","status":"1"}]}';
            //replace error causing characters
            finalizeObject = finalizeObject.replace('"{', '{');
            finalizeObject = finalizeObject.replace('}"', '}');
            AddEqualizerProfiles(finalizeObject);
        } catch (exception) {
            elog(exception);
        }

    });
    $(document).on('click', "#songprofile", function () {
        songprofile_save();
    });
    $(document).on('click', '#shuffle', function () {
        var shuffle_val = GetSession("shuffle");
        if (shuffle_val == "on") {
            $('#shuffle_on').hide();
            $('#shuffle_off').show();
            SaveSession("shuffle", "off");
        } else {
            $('#shuffle_off').hide();
            $('#shuffle_on').show();
            SaveSession("shuffle", "on");
        }
    });
    $(document).on('click', '#repeat', function () {
        var repeat_val = GetSession("repeat");
        if (repeat_val == "on") {
            $('#repeat_on').hide();
            $('#repeat_off').show();
            SaveSession("repeat", "off");
        } else {
            $('#repeat_off').hide();
            $('#repeat_on').show();
            SaveSession("repeat", "on");
        }
    });

    $(document).on('click', '#playprev', function () {
        try {
            //window.wavesurfer.pause();
            //wavesurfer.fireEvent('finish');
            var currSong = GetSession("song_ID");
            var shuffle = GetSession("shuffle");
            var obj = {};
            var obj_inappSongList = $("#inappSongList > li");
            var obj_songlist = $("#song-list > li");

            if (obj_inappSongList.length== 0) {
                obj =obj_songlist;
            } else {
                obj =obj_inappSongList;
            }
            var songArray = $.makeArray(obj);
            var len = songArray.length;
            if (shuffle == "on") {
                var randomNum = Math.floor(Math.random() * Math.floor(len));
                $("#" + songArray[randomNum].id).children("label").click();
            } else if (shuffle == "off") {
                for (var index = 0; index < len - 1; index++) {
                    if (songArray[index].id == currSong) {
                        if (index != 0) {
                            $("#" + songArray[index - 1].id).children("label").click();
                        }
                    }
                }
            }
        }
        catch (exception) {
            elog(exception);
        }
    });
    $(document).on('click', '#playnext', function () {
        try {
            // wavesurfer.fireEvent('finish');           
           // var FromN=$(this).parent().attr('id');
            var currSong = GetSession("song_ID");
            var shuffle = GetSession("shuffle");
            var obj = {};
            var obj_inappSongList = $("#inappSongList > li");
            var obj_songlist = $("#song-list > li");

            if (obj_inappSongList.length== 0) {
                obj =obj_songlist;
            } else {
                obj =obj_inappSongList;
            }
            var songArray = $.makeArray(obj);
            var len = songArray.length;
            if (shuffle == "on") {
                var randomNum = Math.floor(Math.random() * Math.floor(len));
                $("#" + songArray[randomNum].id).children("label").click();
            } else if (shuffle == "off") {
                for (var index = 0; index < len - 1; index++) {
                    if (songArray[index].id == currSong) {
                        if (index != (len - 1)) {
                            $("#" + songArray[index + 1].id).children("label").click();
                        }
                    }
                }
            }
        }
        catch (exception) {
            elog(exception);
        }
    });


    /*aftab Ahmad */
    $(document).on('click', '#play ', function () {
        window.wavesurfer.playPause();
        // if ($('#pause_img').css('display') == 'none') {
        //     $('#play_img').hide();
        //     $('#pause_img').show();
        // } else {
        //     $('#play_img').show();
        //     $('#pause_img').hide();
        // }
    });

    // $(document).on('click', '#repeat', function () {
    //     if ($('.repeat_off').css('display') == 'none') {
    //         $('.repeat_on').hide();
    //         $('.repeat_off').show();
    //     } else {
    //         $('.repeat_on').show();
    //         $('.repeat_off').hide();
    //     }
    // });   
    // $(document).on('click', '#shuffle ', function () {       
    //     if ($('.shuffle_off').css('display') == 'none') {
    //         $('.shuffle_on').hide();
    //         $('.shuffle_off').show();
    //     } else {
    //         $('.shuffle_on').show();
    //         $('.shuffle_off').hide();
    //     }      
    // });

});

function PlayPauseCurrentSong() {
    try {
        window.wavesurfer.playPause();
    }
    catch (exception) {
        elog(exception);
    }
}
function PlaySong(current_song, song_name, artist_name, song_ID) {
    try {
        var currPage = $.mobile.activePage.attr('id');
        if (currPage != "player_page") {
            $.mobile.changePage("#player_page");
        }
        //$(this).parent().attr('id');
         // ShowLoader("Loading...", true);
        // var FromN=$(this).parent().attr('id');       
        // SaveSession("FromN", FromN);
        SaveSession("song_ID", song_ID);
        // $('#waveform').empty();
        $('#equalizer').empty();
        $("#time_current").html("");
        $("#time_total").html("");
        $('#Song_name').html(song_name);
        $('#Artist_name').html(artist_name);
        //log(current_song);
        window.wavesurfer.load(current_song);
        // window.wavesurfer.play();
        // $('.play_image').hide();
        // $('.pause_image').show();
        // HideLoader();
    }
    catch (exception) {
        HideLoader();
        elog(exception);
    }
}

function AddEqualizerProfiles(_ProfileData) {
    try {
        log("AddEqualizerProfiles starts");

        var promiseDone = PostAjax(window.api + "/addprofile", _ProfileData);
        promiseDone.done(function (resultData) {
            log(resultData);
        });
        log("AddEqualizerProfiles completes");
    } catch (exception) {
        elog(exception);
    }
};
// request profile data from server using name
function GetAllEqualizerProfiles() {
    try {
        log("GetAllEqualizerProfiles starts");
        var promiseDone = GetAjax("http://testingserver.net/audio/api/getprofile");
        promiseDone.done(function (resultData) {
            var profile = JSON.stringify(resultData.profile);
            profile = eval(profile.replace(/\"/g, "'"));
            var optionSelect = "";
            var profileLi = "";
            var Plyer_profileLi = "";

            $.each(profile, function (index, key) {
                optionSelect += "<option value=" + key.id + ">" + key.name + "</option>";
                Plyer_profileLi += '<li onclick="SelectProfile_Player(' + key.id + ',&#34;' + key.name + '&#34;)" data-id=' + key.id + '>' + key.name + '</li>';
                profileLi += '<li onclick="SelectProfile(' + key.id + ')" data-id=' + key.id + '>' + key.name + '</li>';
            });

            $("#ListProfiles").html(profileLi);
            $("#ListProfiles").listview('refresh');
            $("#Player_ListProfiles").html(Plyer_profileLi);
            $("#Player_ListProfiles").listview('refresh');
            $("#ddlEqProfile").html(optionSelect);
            $("#ddlEqProfile").html(optionSelect);
        });
        log("GetAllEqualizerProfiles complete");
    } catch (exception) {
        elog(exception);
    }
};
// request profile data from server using name
function GetEqualizerProfileById() {
    try {

        log("GetEqualizerProfiles starts");

        var promiseDone = GetAjax("http://testingserver.net/audio/api/addprofile");
    } catch (exception) {
        elog(exception);
    }
};
// request profile data from server using name
function GetEqualizerProfileByName(_profileName) {
    try {

        log("GetEqualizerProfileByName starts");
        var promiseDone = GetAjax("http://testingserver.net/audio/api/getprofile/" + _profileName);
        var promise_doneResult = promiseDone.done(function (resultData) {
            return resultData;
        });
        return promise_doneResult;
        log('GetEqualizerProfileByName complete');
    } catch (exception) {
        elog(exception);
    }
};
// start song play list work
// function GetSongFromDevice() {


//     $("#song-list").empty();
//     $("#album-list").empty();
//     $("#artist-list").empty();
//     var songLi = "";
//     var albumLi = "";
//     var artistLi = "";
//     var fileStr = "";
//     var index = 0;
//     var counter = 0;
//     try {
//         var localURLs = [
//             // cordova.file.cacheDirectory,
//             // cordova.file.applicationDirectory,
//             // cordova.file.applicationStorageDirectory,
//             // cordova.file.dataDirectory,
//             // cordova.file.externalApplicationStorageDirectory,
//             cordova.file.externalCacheDirectory,
//             cordova.file.externalDataDirectory,
//             cordova.file.documentsDirectory,
//             cordova.file.externalRootDirectory,
//             cordova.file.sharedDirectory,
//             cordova.file.syncedDataDirectory
//         ];
//         /* Recursive function for file entry. */
//         window.plugins.spinnerDialog.show(null,null,true);
//         var addFileEntry = function (dir) {
//            // log(dir);
//             var dirReader = dir.createReader();
//             dirReader.readEntries(function (entries) {
//                 // log(dirReader.localURL, "directoryReader=");
//                 $("#song-list").listview();
//                 $("#album-list").listview();
//                 $("#artist-list").listview();
//                // log("Size " + entries.length);
//                 for (index = 0; index < entries.length; index++) {
//                     //log(entries[index].name);
//                     if (entries[index].isDirectory === true) {
//                         // Recursive -- call back into this subdirectory
//                         // if(entries[index]."/Pictures/") 9 mar 2018
//                         addFileEntry(entries[index]);
//                     } else {
//                         try {
//                              //log(entries[index].name);
//                             if (/\.(?:wav|mp3|wma)$/i.test(entries[index].name)) {
//                                 try {
//                                     log(entries[index].name);
//                                     var entry = entries[index];
//                                     var name = entry.name;
//                                     if (entry.isFile) {
//                                         entry.file(function (file) {
//                                             //log("doing index " + counter);
//                                             ID3.loadTags(entry.name, function () {
//                                                 var tags = ID3.getAllTags(name);
//                                                 // jlog(tags, "tags=");
//                                                 try {
//                                                     counter = counter + 1;
//                                                     var albumString = "";
//                                                     var artistString = "";

//                                                    try {
//                                                         if (tags.album) {
//                                                             albumString = tags.album.replace(/\s+/g, '_');
//                                                         }
//                                                         if (tags.artist) {
//                                                             artistString = tags.artist.replace(/\s+/g, '_');
//                                                         }

//                                                    } catch (error) {
//                                                        elog(error);
//                                                    } 
//                                                     songLi = '<li  id="song-' + counter + '"  data-song="' + file.localURL + '"  data-artist="' + artistString + '"  data-album="' + albumString + '" class="song_list" >';
//                                                     songLi += '<div class="ui-checkbox hmsong-checkbox" id="gotoparent">';
//                                                     songLi += '<input value="chksong' + counter + '"onclick="SelectSong(' + counter + ');"   class="chkSong" type="checkbox" data-song="' + file.localURL + '" data-songname="' + file.name + '" data-artist="' + artistString + '" data-profileId="1" for="checkbox' + counter + '" name="checkbox" id="chkSong' + counter + '"  mini="false">';
//                                                     songLi += '</div>';
//                                                     songLi += ' <label  onclick="PlaySong(&#34;' + file.localURL + '&#34;,&#34;' + file.name + '&#34;,&#34;' + tags.artist + '&#34;,&#34;songName' + counter + '&#34;,&#34;SongList&#34;)" class="label_song" id="songName' + counter + '">' + file.name + '</label>';
//                                                     songLi += '<p id="artist_name" class="artist_name">'+artistString+'.</p>';
//                                                     songLi += ' <img onclick="Eq_HeadPhone_dialog(&#34;' + counter + '&#34;);" class="headphone" src="image/headphone.png">';
//                                                     songLi += ' </li>';

//                                                     $("#song-list").append(songLi);
//                                                     $("#song-list").listview('refresh');
//                                                     albumLi = '<li  id="ablum-' + counter + '"  data-album="' + albumString + '"  onclick="PlayAlbumSong(&#34;' + albumString + '&#34;)"  class="album_list" >';
//                                                     albumLi += ' <label    class="label_album" id="albumName' + counter + '">' + tags.album + '</label>';
//                                                     albumLi += ' </li>';
//                                                     $("#album-list").append(albumLi);
//                                                     $("#album-list").listview('refresh');

//                                                     artistLi = '<li  id="artist-' + counter + '"  data-artist="' + artistString + '"  onclick="PlayArtistSong(&#34;' + artistString + '&#34;)"  class="artist_list" >';
//                                                     artistLi += ' <label   class="label_artist" id="artistName' + counter + '">' + tags.artist + '</label>';
//                                                     artistLi += ' </li>';
//                                                     $("#artist-list").append(artistLi);
//                                                     $("#artist-list").listview('refresh');
//                                                 }catch (exceptionInner) {
//                                                     elog(exceptionInner);
//                                                 }
//                                             }, {
//                                                     dataReader: FileAPIReader(file)
//                                                 });
//                                         });
//                                     }
//                                 }catch (exception) {
//                                     elog(exception);
//                                 }  // Album working ending
//                             }
//                            // index++;
//                         }catch (exception) {
//                             elog(exception);
//                         }
//                     }
//                 } // for loop end
//                 $("input[type='checkbox']").checkboxradio();
//             },
//                 function (error) {
//                     error("readEntries error: " + error.code);
//                 }
//             )
//         };
//         var addError = function (error) {
//             error("getDirectory error: " + error.code);
//         };
//         /*         Loop through the array.        */
//         for (var indexInner = 0; indexInner < localURLs.length; indexInner++) {           
//             // log(localURLs[index], "localUrls=");
//             if (indexInner==(localURLs.length-1)){               
//                 window.plugins.spinnerDialog.hide();
//            }
//             if (localURLs[indexInner] === null || localURLs[indexInner].length === 0) {
//                 continue; // skip blank / non-existent paths for this platform
//             }           
//             window.resolveLocalFileSystemURL(localURLs[indexInner], addFileEntry, addError);           
//         }

//     } catch (exception) {
//         log(exception);
//     }
// }
// end song play list work
function PlayAlbumSong(_album) {
    try {
        log(_album, "_lbum=");
        var songList = "";
        $("#listname").html(_album);
        $('#inappSongList').listview();
        $('#inappSongList').empty();
        // $("#song-list li").each(function (e) {
        //     // Set the data-name to the item number
        //     if ($(this).data('album') == _album) {
        //         songList = $(this)[0].outerHTML;
        //     }
        // });
        var result = {};
        $("#song-list > li").each(function () {
            var LI = $(this);
            var dataAlbum = LI.find("data-album").context.dataset.album;
            if (dataAlbum == _album) {
                //result[dataAlbum] = [];
                //songList += LI.find("data-song").context.dataset.song;                
                songList += LI[0].outerHTML;
                log(songList);
            }

        });

        log(songList);
        $('#inappSongList').html(songList);
        $('#inappSongList').listview("refresh");
        gotoPage('pageSonglist');
        HideLoader();
    }
    catch (exception) {
        elog(exception);
    }
}

function PlayArtistSong(_artist) {
    try {
        log(_artist, "artist=");
        var songList = "";
        $("#listname").html(_artist);
        $('#inappSongList').listview();
        $('#inappSongList').empty();

        var result = {};
        $("#song-list > li").each(function () {
            var LI = $(this);
            var dataArtist = LI.find("data-artist").context.dataset.artist;
            if (dataArtist == _artist) {
                //result[dataAlbum] = [];
                //songList += LI.find("data-song").context.dataset.song;
                songList += LI[0].outerHTML;
                log(songList);
            }

        });
        log(songList);
        $('#inappSongList').html(songList);
        $('#inappSongList').listview("refresh");
        gotoPage('pageSonglist');
        HideLoader();
    }
    catch (exception) {
        elog(exception);
    }
}
// function PlayAlbumSong(_album) {
//     var FromN = GetSession("FromN");
//     var currSong = GetSession("song_ID");
//     var shuffle = GetSession("shuffle");
//     var obj = $(".PLsongs");

//     var songArray = $.makeArray(obj);
//     var len = songArray.length;
//         try {
//             log(_album, "_lbum=");
//             var songList = "";
//             // songList = $("#song-list").find('[data-album~="' + _album + '"]').data("song");
//             $('#inappSongList').listview();
//             $('#inappSongList').empty();
//             $("#song-list li").each(function (e) {
//                 // Set the data-name to the item number
//                 if ($(this).data('album') == _album) {
//                     songList = $(this)[0].outerHTML;
//                 }
//             });

//             log(songList);
//             $('#inappSongList').html(songList);
//             $('#inappSongList').listview("refresh");
//             gotoPage('pageSonglist');
//             HideLoader();
//         }
//         catch (exception) {
//             elog(exception);
//         }
//     }
function Reset_Value() {
    try {
        $("#eqInput32").val(0);
        $("#eqInput45").val(0);
        $("#eqInput65").val(0);
        $("#eqInput92").val(0);
        $("#eqInput130").val(0);
        $("#eqInput185").val(0);
        $("#eqInput262").val(0);
        $("#eqInput373").val(0);
        $("#eqInput529").val(0);
        $("#eqInput751").val(0);
        $("#eqInput1067").val(0);
        $("#eqInput1515").val(0);
        $("#eqInput2151").val(0);
        $("#eqInput3054").val(0);
        $("#eqInput4337").val(0);
        $("#eqInput6159").val(0);
        $("#eqInput8745").val(0);
        $("#eqInput12418").val(0);
        $("#eqInput17634").val(0);
        $("#eqInput20000").val(0);
        // reset text
        $("#eqText32").val(0);
        $("#eqText45").val(0);
        $("#eqText65").val(0);
        $("#eqText92").val(0);
        $("#eqText130").val(0);
        $("#eqText185").val(0);
        $("#eqText262").val(0);
        $("#eqText373").val(0);
        $("#eqText529").val(0);
        $("#eqText751").val(0);
        $("#eqText1067").val(0);
        $("#eqText1515").val(0);
        $("#eqText2151").val(0);
        $("#eqText3054").val(0);
        $("#eqText4337").val(0);
        $("#eqText6159").val(0);
        $("#eqText8745").val(0);
        $("#eqText12418").val(0);
        $("#eqText17634").val(0);
        $("#eqText20000").val(0);
    } catch (exception) {
        elog(exception);
    }
}
// make json object from frequency bands
var GetSelectedEqJson = function () {
    var eqBandJson = {};
    try {
        eqBandJson.eqJson32 = $('#eqInput32').val();
        eqBandJson.eqJson45 = $('#eqInput45').val();
        eqBandJson.eqJson65 = $('#eqInput65').val();
        eqBandJson.eqJson92 = $('#eqInput92').val();
        eqBandJson.eqJson130 = $('#eqInput130').val();
        eqBandJson.eqJson185 = $('#eqInput185').val();
        eqBandJson.eqJson262 = $('#eqInput262').val();
        eqBandJson.eqJson373 = $('#eqInput373').val();
        eqBandJson.eqJson529 = $('#eqInput529').val();
        eqBandJson.eqJson751 = $('#eqInput751').val();
        eqBandJson.eqJson1067 = $('#eqInput1067').val();
        eqBandJson.eqJson1515 = $('#eqInput1515').val();
        eqBandJson.eqJson2151 = $('#eqInput2151').val();
        eqBandJson.eqJson3054 = $('#eqInput3054').val();
        eqBandJson.eqJson4337 = $('#eqInput4337').val();
        eqBandJson.eqJson6159 = $('#eqInput6159').val();
        eqBandJson.eqJson8745 = $('#eqInput8745').val();
        eqBandJson.eqJson12418 = $('#eqInput12418').val();
        eqBandJson.eqJson17634 = $('#eqInput17634').val();
        eqBandJson.eqJson20000 = $('#eqInput20000').val();
        return eqBandJson;

    } catch (exception) {
        elog(exception);
    }
};
// SET JSON OBJECT TO band
var SetEqJson = function (_eqBandJson) {
    try {
        $('#eqInput32').val(_eqBandJson.eqJson32);
        $('#eqInput45').val(_eqBandJson.eqJson45);
        $('#eqInput65').val(_eqBandJson.eqJson65);
        $('#eqInput92').val(_eqBandJson.eqJson92);
        $('#eqInput130').val(_eqBandJson.eqJson130);
        $('#eqInput185').val(_eqBandJson.eqJson185);
        $('#eqInput262').val(_eqBandJson.eqJson262);
        $('#eqInput373').val(_eqBandJson.eqJson373);
        $('#eqInput529').val(_eqBandJson.eqJson529);
        $('#eqInput751').val(_eqBandJson.eqJson751);
        $('#eqInput1067').val(_eqBandJson.eqJson1067);
        $('#eqInput1515').val(_eqBandJson.eqJson1515);
        $('#eqInput2151').val(_eqBandJson.eqJson2151);
        $('#eqInput3054').val(_eqBandJson.eqJson3054);
        $('#eqInput4337').val(_eqBandJson.eqJson4337);
        $('#eqInput6159').val(_eqBandJson.eqJson6159);
        $('#eqInput8745').val(_eqBandJson.eqJson8745);
        $('#eqInput12418').val(_eqBandJson.eqJson12418);
        $('#eqInput17634').val(_eqBandJson.eqJson17634);
        $('#eqInput20000').val(_eqBandJson.eqJson20000);
        focusFunction();
    } catch (exception) {
        elog(exception);
    }
};
// my work Hassan
function Eq_HeadPhone_dialog(count_val) {
    log("check box id: " + count_val);
    // alert("running");
    // $('#hdn_Song_id').val(_chbox_id);
    SaveSession("song_ID", count_val);
    gotoPage("eqdialog");
}
function SelectProfile(_SelectProfile) {

    log("Value: " + _SelectProfile);
    // var chkbox_id = $('#hdn_Song_id').val();
    var chkbox_id = "chkSong" + GetSession("song_ID");
    $('#' + chkbox_id).attr('data-profileId', _SelectProfile);
    goback();
}
// Eq pic onclick function
function EQLoad() {
    $('#equalizer').toggle();
}
//
function Player_Headphone_Eq_list() {
    gotoPage("Player_dialog");
}
// pass  id and name on cliking the headphone icon to popup list and setting the Equalizer Band value by clicking  
function SelectProfile_Player(_profileId, _profileName) {
    goback();
    SaveSession("profile_ID", _profileId);
    try {
        log("Profile request Start");
        // get id and name and request data
        var selectedEqOptionId = _profileId;
        var selectedEqOptionName = _profileName;
        var ProfileData = GetEqualizerProfileByName(selectedEqOptionName);
        var key_valuesPair = "";
        // get response string convert to json
        ProfileData.done(function (resultData) {
            var profileBand = resultData.profile[0].band;
            profileBand = profileBand.split(',');
            for (var index = 0; index < profileBand.length - 1; index++) {
                key_valuesPair += '"' + profileBand[index].replace(':', '":"') + '",';
            }
            key_valuesPair = '{' + key_valuesPair + '}';
            key_valuesPair = key_valuesPair.replace(',}', '}');
            var finalJson = JSON.parse(key_valuesPair);
            // set received finalized json to inputs
            SetEqJson(finalJson);

        }).done(function () {
            //$('.eqStyle').trigger('change');
            $('.eqStyle').click();
        })
            .fail(function (resultdata) {
                jlog(resultdata);
            });
    } catch (exception) {
        elog(exception);
    }
}
// M.Adeeb  25-Feb to 9-Mar
function SelectSong(indexer) {
    var id = "#chkSong" + indexer;

    if ($(id).prop('checked') == true) {
        $(id).addClass("selected");
    }
    else {
        $(id).removeClass("selected");
    }
}

function Checkbox_Refresh() {

    var obj = $(".chkSong.selected");
    var selected_Songs = $.makeArray(obj);

    $.each(selected_Songs, function (index, key) {
        $('#' + key.id).removeClass("selected");
        $('#' + key.id).prop("checked", false);
    });
}

function SavePlayList(PlaylistName) {
    ShowLoader();
    var User_id = GetLocal("User_Id");
    var obj = $(".chkSong.selected");
    var selected_Songs = $.makeArray(obj);
    var len = selected_Songs.length;

    if (len == 0) {
        log("Please select the Songs");
    } else {

        var playlistsData = "";
        playlistsData += '{"playlists": [{"name": "' + PlaylistName + '",';
        playlistsData += '"user_id":"' + User_id + '",';
        playlistsData += '"songs": [';

        var Songs = "";
        var id_Name = "";
        var data_song_URL = "";
        var profile_Id = "";
        var Song_name = "";
        var data_artist = "";
        var data_profileId = "";

        for (i = 0; i < len; i++) {

            id_Name = '#' + selected_Songs[i].id;
            data_song_URL = $(id_Name).attr('data-song');
            Song_name = $(id_Name).attr('data-songname');
            data_artist = $(id_Name).attr('data-artist');
            data_profileId = $(id_Name).attr('data-profileId');

            Songs += '{"name":"' + Song_name + '",';
            Songs += '"artist":"' + data_artist + '",';
            Songs += '"image": "' + data_song_URL + '",';
            Songs += '"album_id":' + 1 + ',';
            Songs += '"songUrl":"' + data_song_URL + '",';
            Songs += '"profile_id":"' + data_profileId + '"';
            if (i < (len - 1)) { Songs += '},'; } else { Songs += '}'; }
        }
        Songs += ']}]}';

        playlistsData += Songs;
        var PlaylistURL = 'http://testingserver.net/audio/api/addplaylist';
        AddData = JSON.stringify(JSON.parse(playlistsData));
        var PlayList_Save = PostAjax(PlaylistURL, AddData);

        PlayList_Save.done(function () {
            log("Play List Save Done");
            Checkbox_Refresh();
            HideLoader();
        });

    }
}

function getAllPlaylist() {
    log("Get Paly List Start");

    ShowLoader();
    var userId = GetLocal("User_Id");
    log("Paly List Page Start");
    log(userId);

    $("#userpalylist").empty();
    $("#play-list").empty();

    var PlayListDone = GetAjax("http://testingserver.net/audio/api/getplaylist/" + userId);
    PlayListDone.done(function (resultData) {
        try {
            var AllPlaylistname = JSON.parse(JSON.stringify(resultData.data));
            // log(AllPlaylistname);
            var playListLi = "";
            $.each(AllPlaylistname, function (index, key) {
                playListLi += "<li class='song_list'>";
                playListLi += "<div class='hmsong-checkbox'></div>";
                playListLi += "<label onclick='SongsFromPL(" + key.id + ");' class='artist_album_label' >" + key.name + "</label>";
                playListLi += "<p class='album_artist_count'>...</p></li>";

            });
            var playListDDL = "";
            $.each(AllPlaylistname, function (index, key) {
                playListDDL += '<option value=' + key.id + '>' + key.name + '</option>';
            });
            $("#userpalylist").listview().append(playListDDL);
            $("#play-list").listview().append(playListLi);
        }
        catch (exception) {
            elog(exception);
        }
    }).done(function () {
        $("#userpalylist").listview('refresh');
        $("#play-list").listview('refresh');
        HideLoader();
    });

    log("Get Paly List End ");
}
function SongsFromPL(index) {
    $.mobile.navigate("#pageSonglist");
    var user_id_val = GetLocal("User_Id");
    // $('#play_List_ID').val(index);
    SaveSession("playListId", index);
    log("Song List Start");
    $("#inappSongList").listview();
    $("#inappSongList").empty();

    var PLsongsDone = GetAjax("http://testingserver.net/audio/api/getplaylist/" + user_id_val + "/" + index);

    PLsongsDone.done(function (resultData) {
        $("#listname").html(JSON.parse(JSON.stringify(resultData.data.playlists)).name);
        var AllSongs = JSON.parse(JSON.stringify(resultData.data.playlists.songs));
        log(AllSongs);
        var SongList = "";

        $.each(AllSongs, function (i, key) {
            // SongList += "<li><a id='PLsongs" + i + "' class='PLsongs' onclick='PlaySong(&#34;" + key.songUrl + "&#34;,&#34;" + key.name + "&#34;,&#34;" + key.artist + "&#34,&#34;PLsongs" + i + "&#34;);'>" + key.name + "</a></li>";
            SongList += '<li  id="PLsongs' + i + '"   data-song=""  data-artist=""  data-album="" class="song_list" >';
            SongList += '<div class="ui-checkbox hmsong-checkbox" id="gotoparent">';
            SongList += '<input value="chksong' + i + '"onclick="SelectSong(' + i + ');"   class="chkSong" type="checkbox" data-song="" data-songname="" data-artist="" data-profileId="1" for="checkbox' + i + '" name="checkbox" id="PLchkSong' + i + '"  mini="false">';
            SongList += '</div>';
            SongList += ' <label onclick="PlaySong(&#34;' + key.songUrl + '&#34;,&#34;' + key.name + '&#34;,&#34;' + key.artist + '&#34,&#34;PLsongs' + i + '&#34;);" class="label_song" id="PLsongName' + i + '">' +key.name + '</label>';
            SongList += '<p class="artist_name">' + key.artist+ '</p>';
            SongList += ' <img onclick="Eq_HeadPhone_dialog(&#34;' + i + '&#34;);" class="headphone" src="image/headphone.png">';
            SongList += ' </li>';
        });
        log(SongList);

        try {
            $("#inappSongList").html(SongList);
            $("#inappSongList").listview('refresh');

        } catch (exception) {
            log(exception);
        }
    });

    log("Song List Page End ");
};

function focusFunction() {
    $('#eqInput32').focus();
    $('#eqInput45').focus();
    $('#eqInput65').focus();
    $('#eqInput92').focus();
    $('#eqInput130').focus();
    $('#eqInput185').focus();
    $('#eqInput262').focus();
    $('#eqInput373').focus();
    $('#eqInput529').focus();
    $('#eqInput751').focus();
    $('#eqInput1067').focus();
    $('#eqInput1515').focus();
    $('#eqInput2151').focus();
    $('#eqInput3054').focus();
    $('#eqInput4337').focus();
    $('#eqInput6159').focus();
    $('#eqInput8745').focus();
    $('#eqInput12418').focus();
    $('#eqInput17634').focus();
    $('#eqInput20000').focus();
}

function upDateplayList() {
    ShowLoader();
    try {
        var playlist_select = $('#userpalylist').val();
        var userId = GetLocal("User_Id");
        var obj = $(".chkSong.selected");
        var selected_Songs = $.makeArray(obj);
        var len = selected_Songs.length;

        log("Play List Id: " + playlist_select);
        log("User Id: " + userId);
        log("Obj: " + len);

        if (len == 0) {
            log("Please select the Songs");
        }
        else {
            var playlistsData = "";
            playlistsData += '{"playlists": [{"id":"' + playlist_select + '",';
            playlistsData += '"songs": [';

            var Songs = "";
            var id_Name = "";
            var data_song_URL = "";
            var profile_Id = "";
            var Song_name = "";

            for (i = 0; i < len; i++) {
                id_Name = '#' + selected_Songs[i].id;
                data_song_URL = $(id_Name).attr('data-song');
                Song_name = $(id_Name).attr('data-songname');
                Songs += '{"name":"' + Song_name + '",';
                Songs += '"artist": "Artist",';
                Songs += '"image": "' + data_song_URL + '",';
                Songs += '"album_id":' + 1 + ',';
                Songs += '"songUrl":"' + data_song_URL + '",';
                Songs += '"profile_id":"01"';
                if (i < (len - 1)) { Songs += '},'; } else { Songs += '}'; }
            }
            Songs += ']}]}';
            playlistsData += Songs;

            var PlayListUpdateURL = 'http://testingserver.net/audio/api/updateplaylist';
            var UpdateData = JSON.stringify(JSON.parse(playlistsData));
            var playList_Update = PostAjax(PlayListUpdateURL, UpdateData);

            playList_Update.done(function () {
                log("Play List Update Done");
                Checkbox_Refresh();
                HideLoader();
            });
        }
    }
    catch (exception) {
        elog(exception);
    }
}

// save profile 
function songprofile_save() {
    try {
        var currentPlaylistID = GetSession("playListId");
        var User_id = GetLocal("User_Id");
        var songId = GetSession("song_ID");
        var profileId = GetSession("profile_ID");
        var profileGetLink = "http://testingserver.net/audio/api/getplaylist/" + User_id + "/" + currentPlaylistID;
        var promiseDone = GetAjax(profileGetLink);
        promiseDone.done(function (resultData) {
            var allSongs = resultData.data.playlists.songs;
            var changedSong = "";
            $.each(allSongs, function (index, key) {
                /*find the current song in the and change profile ID*/
                if (key.id === parseInt(songId)) {
                    // change profile id
                    key.profile_id = profileId;
                    changedSong = key;
                }
            });
            // log('SONG IS FOUNDED' + changedSong);
            // send the changed song
            var ProfileData = "";
            var finalSongData = changedSong;
            log(finalSongData)
            ProfileData += '{"playlists": [{';
            ProfileData += '"id":"' + currentPlaylistID + '",';
            ProfileData += '"songs": [{"name":"' + finalSongData.name + '",';
            ProfileData += '"artist": "' + finalSongData.artist + '",';
            ProfileData += '"image": "' + finalSongData.image + '",';
            ProfileData += '"album_id":' + 1 + ',';
            ProfileData += '"songUrl":"' + finalSongData.songUrl + '",';
            ProfileData += '"profile_id":"' + finalSongData.profile_id + '"}]}]}';

            log('final profile data' + JSON.stringify(JSON.parse(ProfileData)));
            ProfileData = JSON.stringify(JSON.parse(ProfileData));

            /*send the changed profile*/
            var sendingPromiseDone = PostAjax('http://testingserver.net/audio/api/updateplaylist', ProfileData);
            sendingPromiseDone.done(function (resultData) {
                log(resultData);
            });
        });
    }
    catch (exception) {
        elog(exception);
    }
}

function GetSongFromDevice() {
    var entry_obj = [];// new array(); 
    var localURLs = [
        cordova.file.cacheDirectory,
        // cordova.file.applicationDirectory,
        // cordova.file.applicationStorageDirectory,
        cordova.file.dataDirectory,
        cordova.file.documentsDirectory,
        cordova.file.externalApplicationStorageDirectory,
        cordova.file.externalCacheDirectory,
        cordova.file.externalDataDirectory,
        cordova.file.externalRootDirectory,
        cordova.file.sharedDirectory,
        cordova.file.syncedDataDirectory
    ];
    /* Recursive function for file entry. */
    var addFileEntry = function (dir) {
        var dirReader = dir.createReader();
        dirReader.readEntries(function (entries) {
            // log(dirReader.localURL, "directoryReader=");
            for (index = 0; index < entries.length; index++) {
                if (entries[index].isDirectory === true) {
                    // Recursive -- call back into this subdirectory
                    addFileEntry(entries[index]);
                } else if (/\.(?:wav|mp3|wma)$/i.test(entries[index].name)) {
                    entry_obj.push(entries[index]);
                }
            }
        },
            function (error) {
                error("readEntries error: " + error.code);
            }
        )
    };
    var addError = function (error) {
        error("getDirectory error: " + error.code);
    };

    $.each(localURLs, function (i, key) {
        if (key === null || key.length === 0) {
            log("Local Urls:" + key);
        } else {
            window.resolveLocalFileSystemURL(key, addFileEntry, addError);

        }
    });
    log(entry_obj);
    return entry_obj;
}

function scanSongsLi1(entries) {

    var albumString = "";
    var artistString = "";
    var fileUrl = "";
    var name = "";
    var counter = 0;

    var ObjArray = [];
    var albumArray = [];
    var artistArrayLen = [];
    var albumArrayLen = [];
    var artistArrayName = [];
    $.each(entries, function (i, entry) {
        try {
            //log(entry.name);           
            if (entry.isFile) {
                entry.file(function (file) {
                    try {
                    ID3.loadTags(entry.name, function () {
                        //log(entry.name);
                        var tags = ID3.getAllTags(entry.name);

                        counter++;
                        fileUrl = file.localURL;
                        name = file.name;

                        try {
                            if (tags.album) {
                                albumString = tags.album.replace(/\s+/g, '_');
                            } else {
                                albumString = "unknown";
                            }
                            if (tags.artist) {
                                artistString = tags.artist.replace(/\s+/g, '_');
                            } else {
                                artistString = "unknown";
                            }
                        } catch (error) {
                            elog(error);
                        }
                        // albumArray.push(albumString);
                        // artistArray.push(artistString);
                        // $.each(artistArray, function (i, e) {
                        if ($.inArray(e, artistArrayName) === -1) {
                            artistArrayName.push(e);

                        }
                        // });

                    }, {
                            dataReader: FileAPIReader(file)
                        });
                    }
                    catch (exception) {
                        elog(exception);
                    }
                });
            }
        }
        catch (exception) {
            elog(exception);
        }
    });
    var count = {};
    artistArray.forEach(function (i) {
        count[i] = (count[i] || 0) + 1;
    });

    log(artistArray);
    log(artistArrayName);
    log(count);
    $("input[type='checkbox']").checkboxradio();
}

function scanSongsLi(entries) {
    window.plugins.spinnerDialog.show(null, null, true);
    log("li filling");
    $("#song-list").listview();
    $("#album-list").listview();
    $("#artist-list").listview();

    $("#song-list").empty();
    $("#album-list").empty();
    $("#artist-list").empty();

    var songLi = "";
    var albumLi = "";
    var artistLi = "";
    var artistArrayName = [];
    var albumArrayName = [];
    var albumString = "";
    var artistString = "";
    var fileUrl = "";
    var name = "";
    var counter = 0;
    var artist_id = 0;
    var album_id = 0;

    $.each(entries, function (i, entry) {
        try {
            log(entry.name);
            if (entry.isFile) {
                entry.file(function (file) {
                    ID3.loadTags(entry.name, function () {
                        log(entry.name);
                        var tags = ID3.getAllTags(entry.name);

                        counter++;
                        fileUrl = file.localURL;
                        name = file.name;
                        try {
                            if (tags.album) {
                                albumString = tags.album.replace(/\s+/g, '_');
                            } else {
                                albumString = "unknown";
                            }
                            if (tags.artist) {
                                artistString = tags.artist.replace(/\s+/g, '_');
                            } else {
                                artistString = "unknown";
                            }
                        } catch (error) {
                            elog(error);
                        }
                        songLi = '<li  id="song-' + counter + '"   data-song="' + fileUrl + '"  data-artist="' + artistString + '"  data-album="' + albumString + '" class="song_list" >';
                        songLi += '<div class="ui-checkbox hmsong-checkbox" id="gotoparent">';
                        songLi += '<input value="chksong' + counter + '"onclick="SelectSong(' + counter + ');"   class="chkSong" type="checkbox" data-song="' + fileUrl + '" data-songname="' + name + '" data-artist="' + artistString + '" data-profileId="1" for="checkbox' + counter + '" name="checkbox" id="chkSong' + counter + '"  mini="false">';
                        songLi += '</div>';
                        songLi += ' <label onclick="PlaySong(&#34;' + fileUrl + '&#34;,&#34;' + name + '&#34;,&#34;' + artistString + '&#34;,&#34;song-' + counter + '&#34;)" class="label_song" id="songName' + counter + '">' + name + '</label>';
                        songLi += '<p id="artist_name" class="artist_name">' + artistString + '</p>';
                        songLi += ' <img onclick="Eq_HeadPhone_dialog(&#34;' + counter + '&#34;);" class="headphone" src="image/headphone.png">';
                        songLi += ' </li>';

                        $("#song-list").append(songLi);
                        $("#song-list").listview('refresh');
                        if ($.inArray(artistString, artistArrayName) === -1) {
                            artistArrayName.push(artistString);
                            artist_id++;
                            artistLi = "<li class='song_list' id='artist-" + artist_id + "'  data-artist='" + artistString + "'  onclick='PlayArtistSong(&#34;" + artistString + "&#34;)'>";
                            artistLi += "<div class='hmsong-checkbox'></div>";
                            artistLi += "<label class='artist_album_label' id='artistName" + artist_id + "'>" + artistString + "</label>";
                            artistLi += "<p class='album_artist_count'>...</p></li>";

                            // artistLi = '<li  id="artist-' + counter + '"  data-artist="' + artistString + '"  onclick="PlayArtistSong(&#34;' + artistString + '&#34;)"  class="artist_list" >';
                            // artistLi += ' <label   class="label_artist" id="artistName' + counter + '">' + artistString + '</label>';
                            // artistLi += ' </li>';
                            $("#artist-list").append(artistLi);
                            $("#artist-list").listview('refresh');

                        }
                        if ($.inArray(albumString, albumArrayName) === -1) {
                            albumArrayName.push(albumString);
                            album_id++;
                            albumLi = "<li class='song_list' id='ablum-" + album_id + "'  data-artist='" + albumString + "'  onclick='PlayAlbumSong(&#34;" + albumString + "&#34;);'>";
                            albumLi += "<div class='hmsong-checkbox'></div>";
                            albumLi += "<label class='artist_album_label' id='albumName" + album_id + "'>" + albumString + "</label>";
                            albumLi += "<p class='album_artist_count'>...</p></li>";

                            // albumLi = '<li  id="ablum-' + counter + '"  data-album="' + albumString + '"  onclick="PlayAlbumSong(&#34;' + albumString + '&#34;)"  class="album_list" >';
                            // albumLi += ' <label    class="label_album" id="albumName' + counter + '">' + albumString + '</label>';
                            // albumLi += ' </li>';
                            $("#album-list").append(albumLi);
                            $("#album-list").listview('refresh');
                        }
                        if (i == (entries.length - 1)) {
                            HideLoader();
                        }

                    }, {
                            dataReader: FileAPIReader(file)
                        });
                });
            }
        }
        catch (exception) {
            elog(exception);
            HideLoader();
        }
    });
    $("input[type='checkbox']").checkboxradio();
}

$(document).on("deviceready", onDeviceReady);
function onDeviceReady() {
    if (device.platform != "Android") {
        log("Wrong OS", "This example is specifically designed to illustrate runtime permissions on Android 6+, so it will not work on " + device.platform);
        $('body').addClass('error');
        return;
    }
    if (parseInt(device.version) < 7) {
        log("Wrong Android version", "This example is specifically designed to illustrate runtime permissions on Android 6+, but on this version of Android (" + device.version + "), all permissions will be allocated at installation time based on the manifest.");
    }
    CheckCreateEvent();
}

function CheckCreateEvent() {
    var txtPermission = ["READ_EXTERNAL_STORAGE"];
    cordova.plugins.diagnostic.getPermissionsAuthorizationStatus(CheckCreatePermissions, CheckCreatePermissionsError, txtPermission);
}
//create event upload image check permission success
function CheckCreatePermissions(statuses) {
    var txtPermission = "READ_EXTERNAL_STORAGE";
    for (var permission in statuses) {
        var $permission = $('#permissions .' + permission),
            status = statuses[permission];
        if (status != "GRANTED") {
            cordova.plugins.diagnostic.requestRuntimePermission(RequestCreatePermission, RequestCreatePermissionError, txtPermission);
        } else if (status == "GRANTED") {
            window.scanSongs = GetSongFromDevice();
            log("status OK 1");
        }
    }
}
//create event upload image check permission error
function CheckCreatePermissionsError(error) {
    console.log(error);
}
//create event upload image request permission success
function RequestCreatePermission(status) {
    if (status == "GRANTED") {
        window.scanSongs = GetSongFromDevice();
        log("status OK 2");
    }
}
//create event upload image request permission error
function RequestCreatePermissionError() {
    log("failed");
}

