$(document).on('pageshow', function (event, ui) {
    $('.pannelcurrentpage').removeClass('pannelcurrentpage');
    var currentPage = $.mobile.activePage.attr('id');
    if (currentPage == 'main') {
        log(currentPage);
        $('#panelHomeBtn').addClass('pannelcurrentpage');  //high light panel home button      
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
$(document).ready(function () {
    var hamsterdb;
    InitWavesurfer();
    $(document).bind("mobileinit", function () {
        $.mobile.ajaxEnabled = false;
    });
    jQuery(function () {
        $("#panelLink").enhanceWithin().panel();
    });
    SaveSession("shuffle", "off");
    SaveSession("repeat", "off");
    $('#containerPlaylist').hide();
    $('#containerProfile').hide();
    $('#shuffle_on').hide();
    $('#shuffle_off').show();
    $('#repeat_on').hide();
    $('#repeat_off').show();

    $(document).on('click', '#nav_playlist', function () {
        $('#all_play').show();
        $('#add_playlist_hide').hide();
    });
    $(document).on('click', '#nav_songs', function () {
        $('#add_playlist_hide').show();
        $('#all_play').hide();
    });
    $(document).on('click', '#all_play', function () {
        if (GetSession("PL_dir") == "open") {
            $('#currpalylist > li:first').children("div:first").children("p").click();
        } else {
            $('#currpalylist > li:first').click();
        }
    });
    $(document).on('click', ".folders", function () {
        try {
            $("#maindir_name").html($(this).data("dirname"));
            $('#containerFolders').hide();
            $('#containerProfile').hide();
            $('#containerPlaylist').show();
            //$('#add_playlist_hide').show();
            //$('#all_play').hide();
            $("#main").removeClass("main-class");
            $('#profile_icon').show();

        } catch (error) {
            log(error);
        }
    });
    $(document).on('click', "#back_main", function () {
        $('#containerFolders').hide();
        $('#containerProfile').hide();
        $('#containerPlaylist').show();
        $("#main").removeClass("main-class");
        $('#profile_icon').show();
    });
    $(document).on('click', "#backTomain", function () {
        $('#containerProfile').hide();
        $('#containerPlaylist').hide();
        $('#containerFolders').show();
        $("#main").removeClass("main-class");
        $('#profile_icon').show();
    });
    $(document).on('click', "#allcheckbox", function () {
        try {
            if ($('#allcheckbox').is(":checked")) {
                Checkbox_Refresh();
                var obj = $(".chksong");
                var selected_Songs = $.makeArray(obj);
                $.each(selected_Songs, function (index, key) {
                    $('#' + key.id).addClass("selected");
                    $('#' + key.id).prop("checked", true);
                });
            } else {
                Checkbox_Refresh();
            }

        } catch (error) {
            log(error);
        }
    });

    $(document).on('click', '#syncData', function () {
        try {
            $.when(syncLocalDBdata()).then(function () {
                gotoPage("main");
                getAllPlaylist();
                $('#containerFolders').hide();
                $('#containerProfile').hide();
                $('#containerPlaylist').show();
                $("#main").removeClass("main-class");
                $('#profile_icon').show();
                $('#all_play').show();
                $('#add_playlist_hide').hide();
            });

        } catch (error) {
            log(error);
        }
    });
    $(document).on('click', '#save_Profile', function () {
        updateSongwithProfile();
    });
    $(document).on('click', '.ActiveProfile', function () {
        $(this).addClass("ui-active");
    });
    $(document).on('click', "#equalizer_profile", function () {
        try {
            if (checkConnection()) {
                if (GetSession("User_status") == "success") {
                    $('#containerFolders').hide();
                    $('#containerPlaylist').hide();
                    $('#containerProfile').show();
                    $("#main").addClass("main-class");
                    $('#profile_icon').hide();
                    $('#save_Profile').show();
                } else {
                    msg("This feature is available for registered users. Please Sign In");
                    $("#panelLink").panel("open");
                }
            } else {
                msg("No internet connection");
            }

        } catch (error) {
            log(error);
        }
    });
    $(document).on('click', ".profileIMG", function () {
        $("#equalizer_profile").click();
    });
    $(document).on('click', "#profile_icon", function () {
        $("#equalizer_profile").click();
    });
    $(document).on('click', "#back_to_playlist", function () {
        SaveSession("PL_dir", "close");
        getAllPlaylist();
    });
    $(document).on('click', "#save_playlist", function () {
        try {

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
                upDateplayList(playlist_select);
            } else {
                SavePlayList(PL_name);
            }
            // $("#positionWindow").popup("close");
            $("#playlist_name").val("");
            $("#userpalylist").empty();
            $("#play-list").empty();
            getAllPlaylist();

        } catch (error) {
            log(error);
        }
    });
    $(document).on('click', "#back_to_Folders", function () {
        try {
            var curr_dir = GetSession("CurrPath");
            var len = curr_dir.length - 2;
            var pos = curr_dir.lastIndexOf("/", len);
            var dirURL_back = curr_dir.substring(pos, len + 1);
            dirURL_back = curr_dir.replace(dirURL_back, "")
            var main_dir = GetSession("mainPath");
            if (main_dir == dirURL_back) {
                $("#backTomain").click();
            } else {
                scanThisFolder(dirURL_back);
            }

        } catch (error) {
            log(error);
        }
    });
    $(document).on('click', '#shuffle', function () {
        if (GetSession("playbar_Status") == "on") {
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
        }
    });
    $(document).on('click', '#repeat', function () {
        if (GetSession("playbar_Status") == "on") {
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
        }
    });
    $(document).on('click', '#playprev', function () {
        try {
            if (GetSession("playbar_Status") == "on") {
                var currSong = GetSession("song_ID");
                var shuffle = GetSession("shuffle");
                var Id_text, Id_num, len;
                if (~currSong.indexOf("FLsong_id")) {
                    Id_text = "FLsong_name";
                    Id_num = parseInt(currSong.replace("FLsong_id", "")) - 1;
                    len = parseInt(GetSession("currDirSonglen"));
                } else if (~currSong.indexOf("PLsong_id")) {
                    Id_text = "PLsong_name";
                    Id_num = parseInt(currSong.replace("PLsong_id", "")) - 1;
                    len = parseInt(GetSession("currPLsonglen"));
                }
                if (shuffle == "on") {
                    var randomNum = Math.floor(Math.random() * Math.floor(len));
                    $("#" + Id_text + randomNum).click();
                } else if (shuffle == "off") {
                    // if (Id_num < 1) { Id_num=1; }
                    $("#" + Id_text + Id_num).click();
                }
            }
        }
        catch (exception) {
            elog(exception);
        }
    });
    $(document).on('click', '#playnext', function () {
        try {
            if (GetSession("playbar_Status") == "on") {
                var currSong = GetSession("song_ID");
                var shuffle = GetSession("shuffle");
                var Id_text, Id_num, len;
                if (~currSong.indexOf("FLsong_id")) {
                    Id_text = "FLsong_name";
                    Id_num = parseInt(currSong.replace("FLsong_id", "")) + 1;
                    len = parseInt(GetSession("currDirSonglen"));
                } else if (~currSong.indexOf("PLsong_id")) {
                    Id_text = "PLsong_name";
                    Id_num = parseInt(currSong.replace("PLsong_id", "")) + 1;
                    len = parseInt(GetSession("currPLsonglen"));
                }
                if (shuffle == "on") {
                    var randomNum = Math.floor(Math.random() * Math.floor(len));
                    $("#" + Id_text + randomNum).click();
                } else if (shuffle == "off") {
                    //if (Id_num > len) { Id_num=len; }
                    $("#" + Id_text + Id_num).click();
                }
            }
        }
        catch (exception) {
            elog(exception);
        }
    });
    $(document).on('click', '#play', function () {
        if (GetSession("playbar_Status") == "on") {
            window.wavesurfer.playPause();
        }
    });
    $(document).on('click', '#backward', function () {
        if (GetSession("playbar_Status") == "on") {
            window.wavesurfer.skipBackward();
        }
    });
    $(document).on('click', '#forward', function () {
        if (GetSession("playbar_Status") == "on") {
            window.wavesurfer.skipForward();
        }
    });
});
$(document).on("deviceready", onDeviceReady);
function onDeviceReady() {
    if (device.platform != "Android") {
        log("Wrong OS", "This example is specifically designed to illustrate runtime permissions on Android 6+, so it will not work on " + device.platform);
        $('body').addClass('error');
        return;
    }
    if (parseInt(device.version) < 6) {
        log("Wrong Android version", "This example is specifically designed to illustrate runtime permissions on Android 6+, but on this version of Android (" + device.version + "), all permissions will be allocated at installation time based on the manifest.");
        mainDirectoryFolder();
        SaveLocal("playlist_len", "0");
    }

    CheckCreateEvent();
    CreateSqlliteDB();
    var songisPause = false;
    if (window.PhoneCallTrap) {
        PhoneCallTrap.onCall(function (state) {
            log("CHANGE STATE: " + state);
            switch (state) {
                case "RINGING":
                    log("Phone is ringing");
                    var palying = window.wavesurfer.isPlaying();
                    if (palying) {
                        window.wavesurfer.playPause();
                        songisPause = true;
                    }
                    break;
                case "OFFHOOK":
                    console.log("Phone is off-hook");
                    break;

                case "IDLE":
                    console.log("Phone is idle");
                    if (songisPause) {
                        window.wavesurfer.playPause();
                        songisPause = false;
                    }
                    break;
            }
        });
    }// on Call Pause and Play

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
            mainDirectoryFolder();
            getAllPlaylist();
            log("status OK 1");
        }
    }
}
//create event upload image check permission error
function CheckCreatePermissionsError(error) {
    log(error);
}
//create event upload image request permission success
function RequestCreatePermission(status) {
    if (status == "GRANTED") {
        mainDirectoryFolder();
        // SaveLocal("playlist_len", "0");
        log("status OK 2");
    }
}
//create event upload image request permission error
function RequestCreatePermissionError() {
    log("failed");
}
function mainDirectoryFolder() {
    $('#all_play').hide();
    $('#add_playlist_hide').show();
    var dirURL = cordova.file.externalRootDirectory;
    $("#Folder_List").listview();
    $("#Folder_List").empty();
    var dirLi = "";
    var dir_url = "";
    var dirName = "";
    var counter = 0;
    SaveSession("mainPath", dirURL);
    var addFileEntry = function (dir) {
        var dirReader = dir.createReader();
        try {
            dirReader.readEntries(function (entries) {
                // log(dirReader.localURL, "directoryReader=");
                for (index = 0; index < entries.length; index++) {
                    if (entries[index].isDirectory === true) {
                        log(entries[index]);
                        dirName = entries[index].name;
                        dir_url = entries[index].nativeURL;
                        if (dirName[0] != ".") {
                            counter++;
                            dirLi = '<li class="folders" id="dir_id' + counter + '" data-dirname="' + dirName + '"  onclick="scanThisFolder(&#34;' + dir_url + '&#34;);" ><i class="fa fa-folder folderIcon_style"></i>' + dirName + '</li>';
                            $("#Folder_List").append(dirLi);
                            $("#Folder_List").listview('refresh');
                        }

                    }
                }

            },
                function (error) {
                    elog("readEntries error: " + error.code);
                }
            );
        } catch (error) {
            elog("readEntries error: " + error.code);
        }
    };
    var addError = function (error) {
        elog("getDirectory error: " + error.code);
    };
    window.resolveLocalFileSystemURL(dirURL, addFileEntry, addError);
}
function scanThisFolder(dirURL) {
    $("#nav_songs").click();
    $("#song_list").listview();
    $("#song_list").empty();
    var dirLi = "";
    var songLi = "";
    var fileUrl = "";
    var fileName = "";
    var song_counter = 0;
    var dir_counter = 0;
    SaveSession("CurrPath", dirURL);
    var len = dirURL.length - 2;
    var pos = dirURL.lastIndexOf("/", len);
    var currDir = dirURL.substring(pos);
    SaveSession("currDirName", currDir);
    $("#path_text").html(currDir);
    log(currDir);
    var addFileEntry = function (dir) {
        var dirReader = dir.createReader();
        try {
            dirReader.readEntries(function (entries) {
                // log(dirReader.localURL, "directoryReader=");
                for (index = 0; index < entries.length; index++) {
                    if (entries[index].isDirectory === true) {
                        log(entries[index]);
                        if (entries[index].name[0] != ".") {
                            dir_counter++;
                            songLi = '<li id="dir_Id' + dir_counter + '"  onclick="scanThisFolder(&#34;' + entries[index].nativeURL + '&#34;);" ><i class="fa fa-folder folderIcon_style"></i>' + entries[index].name + '</li>';
                            $("#song_list").append(songLi);
                            $("#song_list").listview('refresh');
                            SaveSession("currDirLen", dir_counter);
                        }
                    } else if (/\.(?:wav|mp3|wma)$/i.test(entries[index].name)) {
                        log(entries[index]);
                        var entry = entries[index];
                        if (entry.isFile) {
                            entry.file(function (file) {
                                song_counter++;
                                fileName = file.name;
                                fileUrl = file.localURL;
                                playlistID = "";
                                songLi = ' <li id="FLsong_id' + song_counter + '" class="ui-grid-b audio_list_folder" >';
                                songLi += '<div class="ui-block-a song_check"><input class="chksong"  onclick="SelectSong(' + song_counter + ');"  id="chksong' + song_counter + '" type="checkbox" data-songurl="' + fileUrl + '" data-songname="' + fileName + '"></div>';
                                songLi += '<div class="ui-block-b song_li_name"><p data-profileid="0" id="FLsong_name' + song_counter + '"  onclick="PlaySong(&#34;' + fileUrl + '&#34;,&#34;FLsong_id' + song_counter + '&#34;,&#34;' + playlistID + '&#34;,&#34;' + song_counter + '&#34;);">' + fileName + '</p></div>';
                                songLi += '<div class="ui-block-c song_li_headphone"><img class="profileIMG" id="profileImg' + song_counter + '"  src="image/headphone-small.png"></div>';
                                songLi += '</li>';
                                $("#song_list").append(songLi);
                                $("#song_list").listview('refresh');
                                SaveSession("currDirSonglen", song_counter);
                            });
                        }
                    }
                }
            },
                function (error) {
                    elog("readEntries error: " + error.code);
                }
            );
        } catch (error) {
            elog("readEntries error: " + error.code);
        }
    };
    var addError = function (error) {
        elog("getDirectory error: " + error.code);
    };
    window.resolveLocalFileSystemURL(dirURL, addFileEntry, addError);
}
function PlaySong(current_song, song_ID, playlistID, Id) {
    var profileID = $("#PLsong_name" + Id).data("profileid");
    SaveSession("song_ID", song_ID);
    SaveSession("playlist_ID", playlistID);
    SaveSession("curr_profile_ID", profileID);
    SaveSession("SongURL", current_song);
    log("current_song=", current_song);
    $('#equalizer').empty();
    var artistString = "unknown";
    //var albumString = "unknown";
    try {
        ID3.loadTags(current_song, function () {
            var tags = ID3.getAllTags(current_song);
            try {
                //$("#album_Name").html(tags.album.replace(/\s+/g, '_'));                
                $("#artist_Name").html(tags.artist.replace(/\s+/g, '_'));
                $("#song_Name").html(tags.title.replace(/\s+/g, '_'));
                SaveSession("songName", tags.title.replace(/\s+/g, '_'));
            } catch (error) {
                elog(error);
            }
        });
    }
    catch (exception) {
        elog(exception);
    }

    window.wavesurfer.load(current_song);
    try {
        var songload = true;
        window.wavesurfer.on('play', function () {
            if (songload) {
                songload = false;
                if (profileID) {
                    if (profileID != 0) {
                        if (checkConnection()) {
                            if (GetSession("User_status") == "success") {
                                equalizer_SetValue(parseInt(profileID));
                                $("#equalizer_profile").click();
                                // var promiseDone = GetAjax("http://testingserver.net/audio/api/getprofile");
                                // promiseDone.done(function (resultData) {
                                //     var profile = JSON.stringify(resultData.profile);
                                //     profile = eval(profile.replace(/\"/g, "'"));
                                //     $.each(profile, function (index, key) {
                                //         if (key.id == parseInt(profileID)) {
                                //             log(key.id);
                                //             equalizer_SetValue(parseInt(profileID), key.name);
                                //             $("#equalizer_profile").click();
                                //         }
                                //     });
                                // });

                            }
                        }
                    }
                }
            }

        });
    } catch (exception) {
        elog(exception);
    }
    // $("#time_current").html("");
    // $("#time_total").html("");    
}
function updateSongwithProfile() {
    var song_ID = parseInt(GetSession("song_ID").replace("PLsong_id", ""));
    var playlist_id = GetSession("playlist_ID");
    var profile_id = parseInt(GetSession("profileId"));
    var name = GetSession("songName");
    var songURL = GetSession("SongURL");
    updateSongData(song_ID, name, "artist", "imgPath", songURL, "album", playlist_id, profile_id);

    $("#PLsong_name" + song_ID).data("profileid", profile_id);
    msg("Profile Saved against this song.");
}
function SelectSong(indexer) {
    var id = "#chksong" + indexer;
    if ($(id).prop('checked') == true) {
        $(id).addClass("selected");
    }
    else {
        $(id).removeClass("selected");
    }
}
function Checkbox_Refresh() {
    var obj = $(".chksong.selected");
    var selected_Songs = $.makeArray(obj);
    $.each(selected_Songs, function (index, key) {
        $('#' + key.id).removeClass("selected");
        $('#' + key.id).prop("checked", false);
    });
}
function SavePlayList(PlaylistName) {
    var User_id = "NewUser"
    var obj = $(".chksong.selected");
    var selected_Songs = $.makeArray(obj);
    var len = selected_Songs.length;
    var curr_PL_id;

    if (len == 0) {
        msg("Please select the Songs");
    } else {
        insertPlaylistData(PlaylistName, 1);
        Getplaylistlength().then(function (response) {
            curr_PL_id = response.rows.length;
            var id_Name = "";
            var data_song_URL = "";
            var song_name = "";
            var atrist_name = "";
            var album_name = "";

            for (i = 0; i < len; i++) {
                id_Name = '#' + selected_Songs[i].id;
                data_song_URL = $(id_Name).attr('data-songurl');
                song_name = $(id_Name).attr('data-songname');
                // try {
                //     ID3.loadTags(data_song_URL, function () {
                //         var tags = ID3.getAllTags(data_song_URL);
                //         try {
                //             album_name = tags.album.replace(/\s+/g, '_');
                //             atrist_name = tags.artist.replace(/\s+/g, '_');
                //            insertSongData(song_name, atrist_name, "ImgPath", data_song_URL, album_name, curr_PL_id, 0);
                //         } catch (exception) { elog(exception); }
                //     });
                // } catch (exception) { elog(exception); }
                insertSongData(song_name, atrist_name, "ImgPath", data_song_URL, album_name, curr_PL_id, 0);
            }
        });
        Checkbox_Refresh();
        $('#allcheckbox').prop("checked", false);
        log("Play List Save Done");
        //getAllPlaylist();
    }
}
function getAllPlaylist() {
    log("Get All PalyList Start");
    $('#back_to_playlist').hide();

    $("#currpalylist").listview();
    $("#userpalylist").listview();

    $("#currpalylist").empty();
    $("#userpalylist").empty();
    var playListDDL = '<option>Select</option>';
    var playListLi = "";
    GetplaylistData().then(function (response) {
        var PL_len = response.length, i;
        log("Playlist Length" + PL_len);
        for (i = 0; i < PL_len; i++) {
            var playlist_id = response.item(i).id;
            var playlist_name = response.item(i).name;
            playListLi = '<li  id="' + playlist_id + '"  onclick="songsfromPL(&#34;' + playlist_id + '&#34;,&#34;' + playlist_name + '&#34;);" >';
            playListLi += '<i class="fa fa-folder folderIcon_style"></i>' + playlist_name + '</li>';
            playListDDL = '<option value=' + playlist_id + '>' + playlist_name + '</option>';
            $("#currpalylist").append(playListLi);
            $("#userpalylist").listview().append(playListDDL);
            $("#currpalylist").listview('refresh');
            $("#userpalylist").listview('refresh');
        }
        log("Get All PalyList End ");
    });
}
function songsfromPL(playlist_id, playlist_name) {
    log("Song From PlayList Start");
    $("#currpalylist").listview();
    $("#currpalylist").empty();
    $("#Playlist_text").html(playlist_name);

    var SongList = "";
    SaveSession("currPLName", playlist_name);
    SaveSession("PL_dir", "open");
    //songs Keys (id, name, artist, image, songUrl,album_id, playlist_id, profile_id")   
    GetsongsData(playlist_id).then(function (response) {
        var song_len = response.length, i;
        SaveSession("currPLsonglen", song_len);
        log("songs Length :" + song_len);
        for (i = 0; i < song_len; i++) {
            var songID = response.item(i).id;
            var songName = response.item(i).name;
            var songUrl = response.item(i).songUrl;
            var profileID = response.item(i).profile_id;
            var playlistID = response.item(i).playlist_id;
            SongList += '<li id="PLsong_id' + songID + ' " class="ui-grid-b audio_list" >';
            // SongList += '<div class="ui-block-a song_check"><input class="PLchksong"  onclick="SelectSong(' + i + ');"  id="chksong' + i + '" type="checkbox" data-songurl="' + fileUrl + '" data-songname="' + fileName + '"></div>';
            SongList += '<div class="ui-block-b song_li_name"><p  data-profileid="' + profileID + '" id="PLsong_name' + songID + '"  onclick="PlaySong(&#34;' + songUrl + '&#34;,&#34;PLsong_id' + songID + '&#34;,&#34;' + playlistID + '&#34;,&#34;' + songID + '&#34;);">' + songName + '</p></div>';
            SongList += '<div class="ui-block-c song_li_headphone"><img  class="profileIMG" id="PLprofileImg' + songID + '"  src="image/headphone-small.png"></div>';
            SongList += '</li>';
        }
        $("#currpalylist").html(SongList);
        $("#currpalylist").listview('refresh');
        log("Song List Page End ");
    });

    $('#all_play').show();
    $('#add_playlist_hide').hide();
    $('#back_to_playlist').show();

}
function upDateplayList(playlist_id) {
    var obj = $(".chksong.selected");
    var selected_Songs = $.makeArray(obj);
    var len = selected_Songs.length;
    var curr_PL_id = playlist_id;

    if (len == 0) {
        msg("Please select the Songs");
    } else {
        var id_Name = "";
        var data_song_URL = "";
        var song_name = "";
        var atrist_name = "";
        var album_name = "";

        for (i = 0; i < len; i++) {
            id_Name = '#' + selected_Songs[i].id;
            data_song_URL = $(id_Name).attr('data-songurl');
            song_name = $(id_Name).attr('data-songname');
            // try {
            //     ID3.loadTags(data_song_URL, function () {
            //         try {
            //             var tags = ID3.getAllTags(data_song_URL);
            //             album_name = tags.album.replace(/\s+/g, '_');
            //             atrist_name = tags.artist.replace(/\s+/g, '_');
            //             insertSongData(song_name, atrist_name, "ImgPath", data_song_URL, album_name, curr_PL_id, 0);
            //         } catch (exception) { elog(exception); }
            //     });
            // } catch (exception) { elog(exception); }
            insertSongData(song_name, atrist_name, "ImgPath", data_song_URL, album_name, curr_PL_id, 0);
            status_Set( curr_PL_id, 1);
        }
        Checkbox_Refresh();
        log("Play List Save Done");
    }
}
function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    log('Connection type: ' + states[networkState]);

    if (states[networkState] == 'No network connection') {
        return false;
    } else {
        return true;
    }
}

// Hassan Ali Mahboob
function GetAllEqualizerProfiles() {
    try {
        log("GetAllEqualizerProfiles starts");
        var promiseDone = GetAjax("http://testingserver.net/audio/api/getprofile");
        promiseDone.done(function (resultData) {
            var profile = JSON.stringify(resultData.profile);
            profile = eval(profile.replace(/\"/g, "'"));
            var profileLi = "";

            $.each(profile, function (index, key) {
                profileLi += '<li id="profile' + key.id + '" onclick="equalizer_SetValue(' + key.id + ')" data-id=' + key.id + '>' + key.name + '</li>';
            });

            $("#ListProfiles").html(profileLi);
            $("#ListProfiles").listview('refresh');
        });
        log("GetAllEqualizerProfiles complete");
    } catch (exception) {
        elog(exception);
    }
}
function equalizer_SetValue(_Profile_id) {
    $(".profileSelected").removeClass("profileSelected");
    $("#profile" + _Profile_id).addClass("profileSelected");
    try {
        SaveSession("profileId", _Profile_id.toString());
        var profileData = GetAjax("http://testingserver.net/audio/api/getprofile/" + _Profile_id);
        // var profile_id_is = profileData.id;
        var key_valuesPair = "";
        // get response string convert to json
        profileData.done(function (resultData) {
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
        }).fail(function (resultdata) {
            jlog(resultdata);
        });
    }
    catch (exception) {
        elog(exception);
    }
};
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