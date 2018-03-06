$(document).on('pageshow', function (event, ui) {

    var currentPage = $.mobile.activePage.attr('id');

    if (currentPage == 'main') {

        log(currentPage);
        InitWavesurfer();
    }
    else if (currentPage == 'player_page') {
        HideLoader();
    }
});
// navigation barr functions
function display_songs() {
    try {
        $("#song-list").show(500);
        $("#album-list").hide("slow");
        $("#artist-list").hide("slow");
        $("#play-list").hide("slow");

    } catch (exception) {
        elog(exception);
    }

}

function display_album() {
    try {
        $("#song-list").hide("slow");
        $("#album-list").show("slow");
        $("#artist-list").hide("slow");
        $("#play-list").hide("slow");

    } catch (exception) {
        elog(exception);
    }

}

function display_artist() {
    try {
        $("#song-list").hide("slow");
        $("#album-list").hide("slow");
        $("#artist-list").show("slow");
        $("#play-list").hide("slow");

    } catch (exception) {
        elog(exception);
    }

}

function display_playlist() {
    try {
        $("#song-list").hide("slow");
        $("#album-list").hide("slow");
        $("#artist-list").hide("slow");
        $("#play-list").show("slow");

    } catch (exception) {
        elog(exception);
    }
}

$(document).ready(function () {

    $("#ListProfiles").listview();
    $("#Player_ListProfiles").listview();
    $("#eqdialog").dialog();
    $("#Player_dialog").dialog();
    $("#Equalizer_dialog").dialog();

    GetAllEqualizerProfiles();

    $('#dlgClose').on('click', function () {
        try {
            $('[data-role=dialog]').dialog("close");
        }
        catch (exception) {
            elog(exception);
        }
    });

    $("#Refresh_song").on('click', function () {
        ShowLoader();
        GetSongFromDevice();
        HideLoader();
    });

    $('#sendEqProfile').click(function () {
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

    // M.Adeeb 27-Feb   startTag

    $("#Regbtn").on('click', function () {
        User_SignUp();
    });

    $("#loginbtn").on('click', function () {
        User_SignIn();
    });
    /*
        $(document).on('click', "#SavePlayListbtn", function () {
            var PL_name = $("#PL_Name").val();
            var UserId = GetLocal("User_Id");
            SavePlayList(UserId, PL_name);
            getAllPlaylist(UserId);
            display_playlist();
        });*/
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

   
});

function AddEqualizerProfiles(_ProfileData) {
    try {

        log("AddEqualizerProfiles starts");

        var promiseDone = PostAjax("http://testingserver.net/audio/api/addprofile", _ProfileData);

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
function GetSongFromDevice() {
    $("#song-list").empty();
    $("#album-list").empty();
    var songLi = "";
    var albumLi = "";
    var artistLi = "";
    var fileStr = "";
    var index;
    try {
        var index = 0;
        var localURLs = [
            // cordova.file.cacheDirectory,
            // cordova.file.applicationDirectory,
            // cordova.file.applicationStorageDirectory,
            //cordova.file.dataDirectory,
            cordova.file.documentsDirectory,
            // cordova.file.externalApplicationStorageDirectory,
            // cordova.file.externalCacheDirectory,
            //cordova.file.externalDataDirectory,
            cordova.file.externalRootDirectory,
            cordova.file.sharedDirectory,
            cordova.file.syncedDataDirectory
        ];
        /**
         * Recursive function for file entry.
         */
        var addFileEntry = function (dir) {
            var dirReader = dir.createReader();
            dirReader.readEntries(function (entries) {
                // log(dirReader.localURL, "directoryReader=");

                $("#song-list").listview();
                $("#album-list").listview();
                for (index = 0; index < entries.length; index++) {

                    if (entries[index].isDirectory === true) {
                        // Recursive -- call back into this subdirectory
                        addFileEntry(entries[index]);
                    } else {
                        try {
                            if (/\.(?:wav|mp3|wma)$/i.test(entries[index].name)) {
                                try {
                                    var entry = entries[index];
                                    var name = entry.name;
                                    if (entry.isFile) {
                                        entry.file(function (file) {
                                            log("doing index " + index);
                                            // jlog(file);
                                            ID3.loadTags(entry.name, function () {

                                                var tags = ID3.getAllTags(name);
                                                jlog(tags, "tags=");
                                                try {
                                                    var songId = "song-" + index;

                                                    songLi += '<li  id="' + songId + '"  data-song="' + file.localURL + '"  data-artist="' + tags.artist.replace(/\s+/g, '_') + '"  data-album="' + tags.album.replace(/\s+/g, '_') + '" class="song_list" >';
                                                    songLi += '<div class="ui-checkbox hmsong-checkbox" id="gotoparent">';
                                                    songLi += '<input value="chksong' + index + '"onclick="SelectSong(' + index + ');"   class="chkSong" type="checkbox" data-song="' + file.localURL + '" data-songname="' + file.name + '" for="checkbox' + index + '" name="checkbox" id="chkSong' + index + '"  mini="false">';
                                                    songLi += '</div>';
                                                    songLi += ' <label  onclick="PlaySong(&#34;' + file.localURL + '&#34;)" class="label_song" id="songName' + index + '">' + file.name + '</label>';
                                                    songLi += ' <img onclick="Eq_HeadPhone_dialog(&#34;' + songId + '&#34;);" class="headphone" src="image/headphone.png">';
                                                    songLi += ' </li>';

                                                    $("#song-list").append(songLi);
                                                    $("#song-list").listview('refresh');
                                                    albumLi += '<li  id="ablum-' + index + '"  data-album="' + tags.album.replace(/\s+/g, '_') + '"  onclick="PlayAlbumSong(&#34;' + tags.album.replace(/\s+/g, '_') + '&#34;)"  class="album_list" >';
                                                    albumLi += ' <label    class="label_album" id="albumName' + index + '">' + tags.album + '</label>';
                                                    albumLi += ' </li>';
                                                    $("#album-list").append(albumLi);
                                                    $("#album-list").listview('refresh');

                                                    artistLi += '<li  id="artist-' + index + '"  data-artist="' + tags.artist.replace(/\s+/g, '_') + '"  onclick="PlayArtistSong(&#34;' + tags.artist.replace(/\s+/g, '_') + '&#34;)"  class="artist_list" >';
                                                    artistLi += ' <label   class="label_artist" id="artistName' + index + '">' + tags.artist + '</label>';
                                                    artistLi += ' </li>';
                                                    $("#artist-list").append(artistLi);
                                                    $("#artist-list").listview('refresh');

                                                }
                                                catch (exceptionInner) {
                                                    elog(exceptionInner);
                                                }

                                            }, {
                                                    dataReader: FileAPIReader(file)
                                                });
                                        });
                                    }
                                }
                                catch (exception) {
                                    elog(exception);
                                }


                                // Album working ending
                            }
                            index++;
                        }
                        catch (exception) {
                            elog(exception);
                        }
                    }
                } // for loop end

                //$("#album-list").append(albumLi);
                //$("#album-list").listview('refresh');
                $("input[type='checkbox']").checkboxradio();


            },
                function (error) {
                    error("readEntries error: " + error.code);
                }
            )
        };
        var addError = function (error) {
            error("getDirectory error: " + error.code);
        };

        /*
         Loop through the array.
        */
        for (index = 0; index < localURLs.length; index++) {
            // log(localURLs[index], "localUrls=");
            if (localURLs[index] === null || localURLs[index].length === 0) {
                continue; // skip blank / non-existent paths for this platform
            }
            window.resolveLocalFileSystemURL(localURLs[index], addFileEntry, addError);
        }

    } catch (exception) {
        log(exception);
    }
}
// end song play list work
function PlayPauseCurrentSong() {
    try {
        window.wavesurfer.playPause();
    }
    catch (exception) {
        elog(exception);
    }
}

    var songsarray = [];
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
});


/*
$(document).on('click', "#add_playlist", function () {
   // openPopup("positionWindow");
   // $( "#add_playlist" ).popup( "open" );
});

$("#add_playlist").click(function () {*/
$("#add_playlist").on('click', function () {
    $('#positionWindow').popup('open');
   
});
$("#submit-playlist").on('click', function () {
    var PL_name = $("#play-list-name").val();
    if (PL_name == "") {
        $('#play-list-name').css({
            'color': 'red',
            'font-size': '15px'
        });
        $('#play-list-name').val(' Enter Play-List Name !');
        $('#play-list-name').on('focus', function () {
            $('#play-list-name').val('');
            $('#play-list-name').removeAttr('style');
        });
    }
    else {  
    SavePlayList(PL_name);
    $("#positionWindow").popup("close");
    getAllPlaylist();
    display_playlist();
    }
});

function PlaySong(current_song) {
    try {
        ShowLoader();
        log(current_song);

        window.wavesurfer.load(current_song);

        window.wavesurfer.play();

        openDialog('player_page');
    }
    catch (exception) {
        elog(exception);
    }
}
function PlayAlbumSong(_album) {
    try {
        log(_album, "_lbum=");
        var songList = "";
        // songList = $("#song-list").find('[data-album~="' + _album + '"]').data("song");
        $('#inappSongList').listview();
        $('#inappSongList').empty();
        $("#song-list li").each(function (e) {
            // Set the data-name to the item number
            if ($(this).data('album') == _album) {
                songList = $(this)[0].outerHTML;
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
        $('#inappSongList').listview();
        $('#inappSongList').empty();

        $("#song-list li").each(function (e) {
            // Set the data-name to the item number
            if ($(this).data('artist') == _artist) {
                songList = $(this)[0].outerHTML;
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
};


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
    } catch (exception) {
        elog(exception);
    }

};


// my work Hassan
// i'm getting song id and set value to hdn_Song_id
function Eq_HeadPhone_dialog(_songlid) {
    log(_songlid);
    // alert("running");
    $('#hdn_Song_id').val(_songlid);
    openDialog("eqdialog");

}
// here wo close dialog and assigne attribue with song id profile
function SelectProfile(_SelectProfile) {
    // alert("Value: "+ _SelectProfile);
    var song_id = $('#hdn_Song_id').val();
    $('#' + song_id).attr('data-profile', _SelectProfile);
    $("#eqdialog").dialog("close");

}
// Eq pic onclick function
function EQLoad() {
    $.mobile.changePage("#Equalizer_dialog");
}
//
function Player_Headphone_Eq_list() {
    $.mobile.changePage("#Player_dialog");
}
// pass  id and name on cliking the headphone icon to popup list and setting the Equalizer Band value by clicking  
function SelectProfile_Player(_profileId, _profileName) {
    $("#Player_dialog").dialog("close");

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

        })
            .done(function () {
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


// M.Adeeb  25-Feb to 27
function SelectSong(indexer) {
    var id = "#chkSong" + indexer;

    if ($(id).prop('checked') == true) {
        $(id).addClass("selected");
    }
};

function Checkbox_Refresh() {

    var obj = $(".chkSong.selected");
    var selected_Songs = $.makeArray(obj);

    $.each(selected_Songs, function (index, key) {
        $('#' + key.id).removeClass("selected");
        $('#' + key.id).prop("checked", false);
    });
};


function SavePlayList(PlaylistName) {

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
        var PlaylistURL = 'http://testingserver.net/audio/api/addplaylist';
        AddData = JSON.stringify(JSON.parse(playlistsData));
        var PlayList_Save = PostAjax(PlaylistURL, AddData);

        PlayList_Save.done(function () {

            log("Done");
            Checkbox_Refresh();
        });

    }
};

function getAllPlaylist() {
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
                playListLi += "<li><a onclick='SongsFromPL(" + key.id + ");' >" + key.name + "</a></li>";
            });
            var playListDDL = "";
            $.each(AllPlaylistname, function (index, key) {
                playListDDL += '<option value='+ key.id  + '>' + key.name + '</option>';
            });
            $("#userpalylist").append(playListDDL);
            $("#userpalylist").listview().listview('refresh');

            $("#play-list").append(playListLi);
            $("#play-list").listview().listview('refresh');
            display_playlist();
        }
        catch (exception) {
            elog(exception);
        }
    });

    log("Paly List Page End ");
}


function SongsFromPL(index) {
    var user_id_val = GetLocal("User_Id");

    log("Song List Start");
    $("#playlistSongs").listview();
    $("#playlistSongs").empty();

    var PLsongsDone = GetAjax("http://testingserver.net/audio/api/getplaylist/" + user_id_val + "/" + index);

    PLsongsDone.done(function (resultData) {
        var AllSongs = JSON.parse(JSON.stringify(resultData.data.playlists.songs));
        log(AllSongs);
        var SongList = "";

        $.each(AllSongs, function (i, key) {
            SongList += "<li><a  onclick='PlaySong(&#34;" + key.songUrl + "&#34;);'>"+ i + " : " + key.name + "</a></li>";
        });
        log(SongList);
        $("#playlistSongs").append(SongList);
        $("#playlistSongs").listview('refresh');

    })
        .done(function () {
            gotoPage("Playlistpage");
        });

    log("Song List Page End ");
};


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
        log("Done");
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
                gotoPage("main.html");
                getAllPlaylist(GetLocal("User_Id"));

            } else {
                msg('Invalid email or password');
                SaveLocal(User_Id, null);
            }

            log(GetLocal("User_Id"));

            log("Done");
        });
    }
    catch (exception) {
        elog(exception);
    }
}