function InitWavesurfer() {
    try {
        log('wavesurfer init');
        window.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            barWidth: 4,
            height: 50,
            waveColor: '#555555',
            progressColor: '#FFBF00'
        });
        wavesurfer.on('audioprocess', function (time) {
            try {
                var minutes = Math.floor((time % 3600) / 60);
                var seconds = ('00' + Math.floor(time % 60)).slice(-2);
                var totalTime = wavesurfer.getDuration();
                var total_minutes = Math.floor((totalTime % 3600) / 60);
                var total_seconds = ('00' + Math.floor(totalTime % 60)).slice(-2);
                // $("#time_current").html(minutes + ':' + seconds);
                // $("#time_total").html(total_minutes + ':' + total_seconds);
                // wavesurfer.setVolume($('.slider_input').val() / 100);
                var def = Math.floor(totalTime - time);
                if (GetLocal("repeat") == "on" && def == 1) {
                    wavesurfer.seekTo(0);
                    wavesurfer.play();
                } else if (GetLocal("repeat") == "off" && def == 1) {
                    $("#playnext").click();
                }
            } catch (error) { elog(error); }
        });
        wavesurfer.on('loading', function (percents, eventTarget) {
            SaveLocal("playbar_Status", "off");
            $("#progressBar").show();
            $("#progressBar").css({ "width": percents * 0.82 + "%" });
            if (percents >= 100) {
                SaveLocal("playbar_Status", "on");
                wavesurfer.setVolume(1);
                $("#progressBar").hide();
            }
        });
        wavesurfer.on('play', function () {
            $('#play_img').hide();
            $('#pause_img').show();
        });
        wavesurfer.on('pause', function () {
            $('#play_img').show();
            $('#pause_img').hide();
        });
        window.wavesurfer.on('ready', function () {
            wavesurfer.play();
            var EQ = [
                { f: 32, type: 'lowshelf' },        //  Bass 1
                { f: 45, type: 'lowshelf' },        //  Bass 2
                { f: 65, type: 'lowshelf' },        //  Bass 3 
                { f: 92, type: 'lowshelf' },        //  Bass 4
                { f: 130, type: 'lowshelf' },       //  Bass 5
                { f: 185, type: 'lowshelf' },       //  Bass 6
                { f: 262, type: 'lowshelf' },       //  Bass 7
                { f: 373, type: 'peaking' },        //  Mid 1
                { f: 529, type: 'peaking' },        //  Mid 2 
                { f: 751, type: 'peaking' },        //  Mid 3
                { f: 1067, type: 'peaking' },       //  Mid 4
                { f: 1515, type: 'peaking' },       //  Mid 5
                { f: 2151, type: 'peaking' },       //  Mid 6
                { f: 3054, type: 'highshelf' },     //   Treble 1
                { f: 4337, type: 'highshelf' },     //   Treble 2
                { f: 6159, type: 'highshelf' },     //   Treble 3
                { f: 8745, type: 'highshelf' },     //  Treble 4
                { f: 12418, type: 'highshelf' },    //   Treble 5
                { f: 17634, type: 'highshelf' },    //   Treble 6
                { f: 20000, type: 'highshelf' }     //   Treble 7 
            ];
            // Create filters
            var filters = EQ.map(function (band) {
                var filter = window.wavesurfer.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.gain.value = 0;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
                return filter;
            });
            // Connect filters to wavesurfer 
            window.wavesurfer.backend.setFilters(filters);
            var container = document.querySelector('#equalizer');
            container.setAttribute('class', 'containerEqualizer');
            var low_lable = document.createElement('lable');
            low_lable.setAttribute('class', 'eqStyle_low_lable');
            var low_div = document.createElement('div');
            low_div.setAttribute('class', 'eqStyle_low');
            var medium_lable = document.createElement('lable');
            medium_lable.setAttribute('class', 'eqStyle_medium_lable');
            var medium_div = document.createElement('div');
            medium_div.setAttribute('class', 'eqStyle_medium');
            var high_lable = document.createElement('lable');
            high_lable.setAttribute('class', 'eqStyle_high_lable');
            var high_div = document.createElement('div');
            high_div.setAttribute('class', 'eqStyle_heigh');
            var index = 0;
            low_div.appendChild(low_lable);
            medium_div.appendChild(medium_lable);
            high_div.appendChild(high_lable);
            low_lable.innerHTML = "Bass";
            medium_lable.innerHTML = "Mid";
            high_lable.innerHTML = "Treble";
            filters.forEach(function (filter) {
                var input = document.createElement('input');
                window.wavesurfer.util.extend(input, {
                    type: 'range',
                    min: -20,
                    max: 20,
                    value: 0,
                    title: filter.frequency.value,
                    id: "eqInput" + filter.frequency.value
                });
                if (index < 7) {
                    log("less 7 index: " + index);
                    low_div.appendChild(input);
                    input.style.display = 'inline-block';
                    input.setAttribute('orient', 'vertical');
                    window.wavesurfer.drawer.style(input, {
                        'webkitAppearance': 'slider-vertical',
                        width: '8%',
                        height: '75px'
                    });
                    if (index == 6) {
                        low_div = document.createElement('hr');
                    }
                    container.appendChild(low_div);
                } else {
                    if (index < 13) {
                        log("less 12 index: " + index);
                        medium_div.appendChild(input);
                        input.style.display = 'inline-block';
                        input.setAttribute('orient', 'vertical');
                        window.wavesurfer.drawer.style(input, {
                            'webkitAppearance': 'slider-vertical',
                            width: '8%',
                            height: '75px'
                        });
                        if (index == 12) {
                            medium_div = document.createElement('hr');
                        }
                        container.appendChild(medium_div);
                    } else {
                        log("less 20 index: " + index);
                        high_div.appendChild(input);
                        input.style.display = 'inline-block';
                        input.setAttribute('orient', 'vertical');
                        window.wavesurfer.drawer.style(input, {
                            'webkitAppearance': 'slider-vertical',
                            width: '8%',
                            height: '75px'
                        });
                        if (index == 19) {
                            high_div = document.createElement('hr');
                        }
                        container.appendChild(high_div);
                    }
                }
                index++;
                var onChange = function (e) {
                    console.log('change occured');
                    filter.gain.value = ~~e.target.value;
                    console.log(e.target.value);
                    //target id
                    var id = e.target.id;
                    //eqJson.ID_Value.value = e.target.value;
                };
                input.addEventListener('input', onChange);
                input.addEventListener('focus', onChange);
            });// For debugging            
            window.wavesurfer.filters = filters;
        }); // get all equalizer profiles from server and add them to dropdown select
    } catch (exception) { elog(exception); }
}
function DestroyWavesurfer() {
    try {
        if (window.wavesurfer) {
            window.wavesurfer.destroy();
        }
        wavesurfer.setVolume(0.5);
        $("#time_current").html("");
        $("#time_total").html("");
        $('#waveform').empty();
        $('#equalizer').empty();
        $('#equalizer').hide();
    } catch (exception) { elog(exception); }
}