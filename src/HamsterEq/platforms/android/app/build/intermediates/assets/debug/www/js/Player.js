//$(document).ready(function() {


function InitWavesurfer() {
    try {
        DestroyWavesurfer();
        window.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            mediaType: 'audio',
            waveColor: 'violet',
            progressColor: 'purple'
        });


        // Equalizer
        window.wavesurfer.on('ready', function () {
            var EQ = [{
                f: 32,
                type: 'lowshelf'
            }, {
                f: 45,
                type: 'peaking'
            }, {
                f: 65,
                type: 'peaking'
            }, {
                f: 92,
                type: 'peaking'
            }, {
                f: 130,
                type: 'peaking'
            }, {
                f: 185,
                type: 'peaking'
            }, {
                f: 262,
                type: 'peaking'
            }, {
                f: 373,
                type: 'highshelf'
            }, {
                f: 529,
                type: 'highshelf'
            }, {
                f: 751,
                type: 'highshelf'
            }, {
                f: 1067,
                type: 'highshelf'
            }, {
                f: 1515,
                type: 'highshelf'
            }, {
                f: 2151,
                type: 'highshelf'
            }, {
                f: 3054,
                type: 'highshelf'
            }, {
                f: 4337,
                type: 'highshelf'
            }, {
                f: 6159,
                type: 'highshelf'
            }, {
                f: 8745,
                type: 'highshelf'
            }, {
                f: 12418,
                type: 'highshelf'
            }, {
                f: 17634,
                type: 'highshelf'
            }, {
                f: 20000,
                type: 'highshelf'
            }];

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

            // Bind filters to vertical range sliders
            var container = document.querySelector('#equalizer');
            filters.forEach(function (filter) {
                var input = document.createElement('input');
                window.wavesurfer.util.extend(input, {
                    type: 'range',
                    min: -40,
                    max: 40,
                    value: 0,
                    title: filter.frequency.value,
                    id: "eqInput" + filter.frequency.value,
                   
                });
                input.setAttribute('class', 'eqStyle');
                input.style.display = 'inline-block';
                input.setAttribute('orient', 'vertical');
                window.wavesurfer.drawer.style(input, {
                    'webkitAppearance': 'slider-vertical',
                    width: '20px',
                    height: '75px'
                });
                container.appendChild(input);
                var onChange = function (e) {
                    log('onchange bands');
                    filter.gain.value = ~~e.target.value;
                    //console.log(e.target.value);
                    // $('#bandFrequency').text(filter.frequency.value);
                    // $('#bandgain').text(filter.gain.value);

                };
                //var eqStyle = document.querySelector('.eqStyle');
                input.addEventListener('input', onChange);
                input.addEventListener('change', onChange);
                //eqStyle.addEventListener('change', onChange);
               
            });

            // For debugging
            window.wavesurfer.filters = filters;
        });
        // get all equalizer profiles from server and add them to dropdown select
    }
    catch (exception) {
        elog(exception);
    }
}

function DestroyWavesurfer() {
    try {
        if (window.wavesurfer) {
            window.wavesurfer.destroy();
        }
        $('#waveform').empty();
        $('#equalizer').empty();
    }
    catch (exception) {
        log(exception);
    }
}