// DB functions 
function CreateSqlliteDB() {  
    hamsterdb = window.sqlitePlugin.openDatabase({ name: "Hamster.db", location: 2, createFromLocation: 1 });
    hamsterdb.transaction(function (transaction) {
        var exeQuery = 'CREATE TABLE IF NOT EXISTS playlist (id integer primary key, name text, status integer)';
        transaction.executeSql(exeQuery, [],
            function (tx, result) { log("playlist Table created successfully"); },
            function (error) { log("Error occurred while creating the playlist."); });
    });
    hamsterdb.transaction(function (transaction) {
        var exeQuery = 'CREATE TABLE IF NOT EXISTS songs (';
        exeQuery += 'id integer primary key, name text,';
        exeQuery += 'artist text, image text,';
        exeQuery += 'songUrl text, album_id text,';
        exeQuery += 'playlist_id integer, profile_id integer';
        exeQuery += ')';
        transaction.executeSql(exeQuery, [],
            function (tx, result) { log("songs table created successfully"); },
            function (error) { log("Error occurred while creating the songs."); });
    });  
}
function insertPlaylistData(PLname,status_val) {
    log(PLname);
    if(status_val!=1){
        status_val=0;
    }
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "INSERT INTO playlist (name, status) VALUES (?,?)";
        transaction.executeSql(executeQuery, [PLname, status_val],
            function (tx, result) { log('playlist Inserted'); },
            function (error) { log('Error occurred'); });
    });
}
function insertSongData(name, artist, img, songURL, album, playlistId, profileId) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "INSERT INTO songs (";
        executeQuery += "name, artist, image, songUrl,";
        executeQuery += "album_id, playlist_id, profile_id";
        executeQuery += ") VALUES (?,?,?,?,?,?,?)";
        transaction.executeSql(executeQuery, [name, artist, img, songURL, album, playlistId, profileId],
            function (tx, result) { log('songs Inserted'); },
            function (error) { log('Error occurred'); });
    });
}
function updateSongData(id, name, artist, img, songURL, album, playlistId, profileId) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "UPDATE songs SET name=?,";
        executeQuery += "artist=?, image=?, songUrl=?,";
        executeQuery += "album_id=?, playlist_id=?, profile_id=?";
        executeQuery += " WHERE id=?";
        transaction.executeSql(executeQuery, [name, artist, img, songURL, album, playlistId, profileId, id],
            function (tx, result) { 
                log('song Updated');
                status_Set(playlistId, 1);
             },
            function (error) { log('songs went Wrong'); });
    });
}
function updatePlaylistData(id, name) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "UPDATE playlist SET name=? WHERE id=?";
        transaction.executeSql(executeQuery, [name, id],
            //On Success
            function (tx, result) { log('playlist name Updated successfully'); },
            //On Error
            function (error) { log('playlist went Wrong'); });
    });
}
function GetplaylistData() {
    var def = $.Deferred();
    hamsterdb.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM playlist', [], function (tx, results) {
            def.resolve(results.rows);
        }, def.fail);
    }, def.fail);
    return def.promise();
}
function Getplaylistlength() {
    var def = $.Deferred();
    hamsterdb.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM playlist', [], function (tx, results) {
            // var len =results.rows.length;    
            def.resolve(results);
        }, def.fail);
    }, def.fail);
    return def.promise();
}
function GetsongsData(idnum) {
    var def = $.Deferred();
    hamsterdb.transaction(function (transaction) {
        var executeQuery = 'SELECT * FROM songs WHERE  playlist_id=' + idnum;
        transaction.executeSql(executeQuery, [], function (tx, results) {
            def.resolve(results.rows);
        }, def.fail);
    }, def.fail);
    return def.promise();
}
function deleteRow(id, tableName) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "DELETE FROM " + tableName + " where id=?";
        transaction.executeSql(executeQuery, [id],
            //On Success
            function (tx, result) { log('Delete successfully'); },
            //On Error
            function (error) { log('Something went Wrong'); });
    });
}
//         aftab Ahmad & M.Ahwar
function deleteTableRows(tableName) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "DELETE FROM " + tableName;
        transaction.executeSql(executeQuery, [],
            //On Success
            function (tx, result) { log('Delete successfully'); },
            //On Error
            function (error) { log('Something went Wrong'); });
    });
}
function syncLocalDBdata() {
    if (checkConnection()) {
        if (GetLocal("User_status") == "success") {          
            log("Synch and Update of Playlists Data Start");          
            var userId = GetLocal("User_Id");           
            deleteTableRows("playlist");
            deleteTableRows("songs");
            var defr = $.Deferred();
            var PlayListDone = GetAjax("http://testingserver.net/audio/api/getplaylist/" + userId);
            PlayListDone.done(function (PLresultData) {
                try {
                    var AllPlaylistData = JSON.parse(JSON.stringify(PLresultData.data));
                    $.each(AllPlaylistData, function (index, key) {
                        insertPlaylistData(key.name,0);                       
                        var playlist_id = index + 1;
                        var playlistSongDONE = GetAjax("http://testingserver.net/audio/api/getplaylist/" + userId + "/" + key.id);
                        playlistSongDONE.done(function (resultData) {
                            var songsData = JSON.parse(JSON.stringify(resultData.data.playlists.songs));
                            $.each(songsData, function (i, key_val) {
                                var songname = key_val.name;
                                var songartistname = key_val.artist;
                                var songimage = key_val.image;
                                var songurl = key_val.songUrl;
                                var songalbumid = key_val.album_id;
                                var songprofileid = key_val.profile_id;
                                insertSongData(songname, songartistname, songimage, songurl, songalbumid, playlist_id, songprofileid);
                            });
                        });
                    });
                    defr.resolve(PLresultData);
                } catch (exception) {
                    elog(exception);
                }
            }).fail(function (error) {
                elog(error);
            });
            defr.promise().done(function (x){
                getAllPlaylist();
            });
 } else {
            msg("This feature is available for registered users. Please Sign In");
            $("#panelLink").panel("open");
        }
    } else {
        msg("No internet connection");
    }

}
function Get_Active_playlist() {
    var def = $.Deferred();
    hamsterdb.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM playlist WHERE status=1', [], function (tx, results) {
            def.resolve(results.rows);
        }, def.fail);
    }, def.fail);
    return def.promise();
}
function sending_to_server() {
    var user_Id = GetLocal("User_Id");
    var PL_len;
    Get_Active_playlist().done(function (response) {
        PL_len = response.length;
        for (var index = 0; index < PL_len; index++) {
            var curr_PL_id = response.item(index).id;
            var curr_PL_Name = response.item(index).name;
            GetsongsData(curr_PL_id).done(function (inner_response) {
                var song_len = inner_response.length;
                log("songs Length :" + song_len);
                var song_name = "";
                var song_artist = "";
                var song_image = "";
                var song_url = "";
                var song_profile = "";
                var Songs = '{"playlists": [{"name": "' + curr_PL_Name + '",';
                Songs += '"user_id":"' + user_Id + '",';
                Songs += '"songs": [';
                for (var inrIndex = 0; inrIndex < song_len; inrIndex++) {
                    song_name = inner_response.item(inrIndex).name;
                    song_artist = inner_response.item(inrIndex).artist;
                    song_image = inner_response.item(inrIndex).image;
                    song_album = inner_response.item(inrIndex).album_id;
                    song_url = inner_response.item(inrIndex).songUrl;
                    song_profile = inner_response.item(inrIndex).profile_id;
                    Songs += '{"name":"' + song_name + '",';
                    Songs += '"artist":"' + song_artist + '",';
                    Songs += '"image":"' + song_image + '",';
                    Songs += '"album_id":"' + song_album + '",';
                    Songs += '"songUrl":"' + song_url + '",';
                    Songs += '"profile_id":"' + song_profile + '"';
                    if (inrIndex < (song_len - 1)) { Songs += '},'; } else { Songs += '}'; }
                }
                Songs += ']}]}';
                sendAjaxCall(Songs, curr_PL_id);
            });
        }
    });
}
function sendAjaxCall(Songs, curr_PL_id) {
    try {
        var AddData = JSON.stringify(JSON.parse(Songs));
        $.ajax({
            method: "POST",
            url: 'http://testingserver.net/audio/api/addplaylist',
            data: { 'data': AddData },
        }).done(function (data) {
            log('Upload Successfully');
            status_Set(curr_PL_id, 0);
        }).fail(function (exception) {
            log("Error: ", exception);
        });
    }
    catch (error) {
        elog(error);
    }
}
function status_Set(current_playList_id, status_val) {
    hamsterdb.transaction(function (transaction) {
        var executeQuery = "UPDATE playlist SET status=? WHERE id=?";
        transaction.executeSql(executeQuery, [status_val, current_playList_id],
            function (tx, result) {
                log('Status is update');
            },
            function (error) {
                log('Status is not update')
            });
    });
}
function showPlaylistData() {
    hamsterdb.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM playlist', [], function (tx, results) {
            var data_list = results.rows.length;
            for (var index = 0; index < data_list; index++) {
                var data_id = results.rows.item(index).id;
                var data_name = results.rows.item(index).name;
                var data_status = results.rows.item(index).status;
                log(data_id + ":" + data_name + " /" + data_status);
            }
        }, function (error) {
            log('Status is not update')
        });
    });
}
