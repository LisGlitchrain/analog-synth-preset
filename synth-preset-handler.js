// synth-preset-handler.js
document.addEventListener('DOMContentLoaded', function() {
    const ocsY = 0.576;
    const ocs1ParamX = 0.050;
    const ocs2ParamX = 0.1685;
    const row0Y      = 0.862;
    const row1Y      = 0.730;
    const row2Y      = 0.60;
    const row3Y      = 0.468;
    const column0X   = 0.262;
    const column1X   = 0.3235;
    const column2X   = 0.385;
    const column3X   = 0.4468;
    const column4X   = 0.5085;
    const column5X   = 0.57;
    const column6X   = 0.6315;
    const column7X   = 0.6933;

    const jackColumn0X = 0.765;
    const jackColumn1X = 0.7989;
    const jackColumn2X = 0.8328;
    const jackColumn3X = 0.8667;
    const jackColumn4X = 0.9006;
    const jackColumn5X = 0.9345;
    const jackColumn6X = 0.9685;

    const jackRow0Y = 0.5;
    const jackRow1Y = 0.5586;
    const jackRow2Y = 0.6172;
    const jackRow3Y = 0.6758;
    const jackRow4Y = 0.7344;
    const jackRow5Y = 0.793;
    const jackRow6Y = 0.8516;
    const jackRow7Y = 0.9102;

    // Configuration for our synthesizer elements
    const synthConfig = {
        // These positions are relative to the synth image dimensions
        // You'll need to adjust these based on your actual synth image
        knobs: [
            { id: 'osc1-tune',     x: ocs1ParamX,  y: ocsY,  value: 0.5 },
            { id: 'osc1-shape',    x: ocs1ParamX,  y: row1Y, value: 0.5 },
            { id: 'osc1-width',    x: ocs1ParamX,  y: row0Y, value: 0.5 },
            { id: 'osc2-tune',     x: ocs2ParamX,  y: ocsY,  value: 0.5 },
            { id: 'osc2-shape',    x: ocs2ParamX,  y: row1Y, value: 0.5 },
            { id: 'osc2-width',    x: ocs2ParamX,  y: row0Y, value: 0.5 },
            { id: 'osc-mix',       x: 0.109,       y: 0.5145,value: 0.5 },
            { id: 'vcf-freq',      x: column0X,    y: row3Y, value: 0.5 },
            { id: 'vcf-reso',      x: column0X,    y: row2Y, value: 0.5 },
            { id: 'vcf-mod-depth', x: column0X,    y: row1Y, value: 0.5 },
            { id: 'vcf-env-depth', x: column0X,    y: row0Y, value: 0.5 },
            { id: 'lfo-shape',     x: 0.354,       y: ocsY,  value: 0.5 },
            { id: 'lfo-rate',      x: column2X,    y: row3Y, value: 0.5 },
            { id: 'noise',         x: column1X,    y: row1Y, value: 0.5 },
            { id: 'vca-bias',      x: column1X,    y: row0Y, value: 0.5 },
            { id: 'env1-attack',   x: column2X,    y: row1Y, value: 0.5 },
            { id: 'env1-decay',    x: column3X,    y: row1Y, value: 0.5 },
            { id: 'env1-sustain',  x: column4X,    y: row1Y, value: 0.5 },
            { id: 'env1-release',  x: column5X,    y: row1Y, value: 0.5 },
            { id: 'env2-attack',   x: column2X,    y: row0Y, value: 0.5 },
            { id: 'env2-decay',    x: column3X,    y: row0Y, value: 0.5 },
            { id: 'env2-sustain',  x: column4X,    y: row0Y, value: 0.5 },
            { id: 'env2-release',  x: column5X,    y: row0Y, value: 0.5 },
            { id: 'delay-time',    x: column3X,    y: row3Y, value: 0.5 },
            { id: 'delay-repeats', x: column4X,    y: row3Y, value: 0.5 },
            { id: 'delay-mix',     x: column5X,    y: row3Y, value: 0.5 },
            { id: 'od-drive',      x: column3X,    y: row2Y, value: 0.5 },
            { id: 'od-tone',       x: column4X,    y: row2Y, value: 0.5 },
            { id: 'od-level',      x: column5X,    y: row2Y, value: 0.5 },
            { id: 'output-volume', x: column6X,    y: row3Y, value: 0.5 },
            { id: 'sh-rate',       x: column6X,    y: row2Y, value: 0.5 },
            { id: 'sh-glide',      x: column7X,    y: row2Y, value: 0.5 },
            { id: 'srl-slew',      x: column6X,    y: row1Y, value: 0.5 },
            { id: 'srl-time',      x: column7X,    y: row1Y, value: 0.5 },
            { id: 'attenuator1',   x: column6X,    y: row0Y, value: 0.5 },
            { id: 'attenuator2',   x: column7X,    y: row0Y, value: 0.5 }
        ],
        
        buttons: [
            { id: 'osc1-range-8',       x: 0.108,  y: 0.655,  state: false },
            { id: 'osc1-range-16',      x: 0.108,  y: 0.687,  state: false }  ,
            { id: 'osc1-range-32',      x: 0.108,  y: 0.721,  state: false },
            { id: 'osc2-range-8',       x: 0.1345, y: 0.655,  state: false },
            { id: 'osc2-range-16',      x: 0.1345, y: 0.687,  state: false },
            { id: 'osc2-range-32',      x: 0.1345, y: 0.721,  state: false },
            { id: 'osc-sync',           x: 0.12,   y: 0.84,   state: false },
            { id: 'paraphonic',         x: 0.12,   y: 0.9,    state: false },
            { id: 'vcf-mode-low-cut',   x: 0.235,  y: 0.54,   state: true  },
            { id: 'vcf-mode-band-pass', x: 0.235,  y: 0.568,  state: false },
            { id: 'vcf-mode-high-cut',  x: 0.235,  y: 0.596,  state: false },
            { id: 'vcf-track-key',      x: 0.2745, y: 0.695,  state: false },
            { id: 'lfo-key-sync',       x: 0.336,  y: 0.491,  state: false },
        ],
        
        jacks: [
            { id: 'in-osc1',       x: jackColumn0X, y: jackRow0Y, connections: [] },
            { id: 'in-osc2',       x: jackColumn1X, y: jackRow0Y, connections: [] },
            { id: 'in-osc12',      x: jackColumn2X, y: jackRow0Y, connections: [] },
            { id: 'in-invert-in',  x: jackColumn3X, y: jackRow0Y, connections: [] },
            { id: 'out-ocs1',      x: jackColumn4X, y: jackRow0Y, connections: [] },
            { id: 'out-ocs2',      x: jackColumn5X, y: jackRow0Y, connections: [] },
            { id: 'out-ocs-mix',   x: jackColumn6X, y: jackRow0Y, connections: [] },

            { id: 'in-shape1',     x: jackColumn0X, y: jackRow1Y, connections: [] },
            { id: 'in-shape2',     x: jackColumn1X, y: jackRow1Y, connections: [] },
            { id: 'in-pw1',        x: jackColumn2X, y: jackRow1Y, connections: [] },
            { id: 'in-pw2',        x: jackColumn3X, y: jackRow1Y, connections: [] },
            { id: 'out-vcf1',      x: jackColumn4X, y: jackRow1Y, connections: [] },
            { id: 'out-vcf2',      x: jackColumn5X, y: jackRow1Y, connections: [] },
            { id: 'out-overdrive', x: jackColumn6X, y: jackRow1Y, connections: [] },

            { id: 'in-vcf',        x: jackColumn0X, y: jackRow2Y, connections: [] },
            { id: 'in-freq-mod',   x: jackColumn1X, y: jackRow2Y, connections: [] },
            { id: 'in-res',        x: jackColumn2X, y: jackRow2Y, connections: [] },
            { id: 'in-overdrive',  x: jackColumn3X, y: jackRow2Y, connections: [] },
            { id: 'out-vca',       x: jackColumn4X, y: jackRow2Y, connections: [] },
            { id: 'out-output',    x: jackColumn5X, y: jackRow2Y, connections: [] },
            { id: 'out-onoise',    x: jackColumn6X, y: jackRow2Y, connections: [] },

            { id: 'in-vca',        x: jackColumn0X, y: jackRow3Y, connections: [] },
            { id: 'in-vca-cv',     x: jackColumn1X, y: jackRow3Y, connections: [] },
            { id: 'in-delay',      x: jackColumn2X, y: jackRow3Y, connections: [] },
            { id: 'in-delay-time', x: jackColumn3X, y: jackRow3Y, connections: [] },
            { id: 'out-env1',      x: jackColumn4X, y: jackRow3Y, connections: [] },
            { id: 'out-env2',      x: jackColumn5X, y: jackRow3Y, connections: [] },
            { id: 'out-invert',    x: jackColumn6X, y: jackRow3Y, connections: [] },

            { id: 'in-e-gate1',    x: jackColumn0X, y: jackRow4Y, connections: [] },
            { id: 'in-e-gate2',    x: jackColumn1X, y: jackRow4Y, connections: [] },
            { id: 'in-sh',         x: jackColumn2X, y: jackRow4Y, connections: [] },    
            { id: 'in-sh-clock',   x: jackColumn3X, y: jackRow4Y, connections: [] },
            { id: 'out-lfo',       x: jackColumn4X, y: jackRow4Y, connections: [] },
            { id: 'out-lfo-uni',   x: jackColumn5X, y: jackRow4Y, connections: [] },
            { id: 'out-sh',        x: jackColumn6X, y: jackRow4Y, connections: [] },    

            { id: 'in-lfo-rate',   x: jackColumn0X, y: jackRow5Y, connections: [] },
            { id: 'in-lfo-shape',  x: jackColumn1X, y: jackRow5Y, connections: [] },
            { id: 'in-lfo-trig',   x: jackColumn2X, y: jackRow5Y, connections: [] },    
            { id: 'in-mult',       x: jackColumn3X, y: jackRow5Y, connections: [] },
            { id: 'out-mult1',     x: jackColumn4X, y: jackRow5Y, connections: [] },
            { id: 'out-mult2',     x: jackColumn5X, y: jackRow5Y, connections: [] },
            { id: 'out-midi-gate', x: jackColumn6X, y: jackRow5Y, connections: [] },

            { id: 'in-att1',       x: jackColumn0X, y: jackRow6Y, connections: [] },
            { id: 'in-att1-cv',    x: jackColumn1X, y: jackRow6Y, connections: [] },
            { id: 'in-att2',       x: jackColumn2X, y: jackRow6Y, connections: [] },    
            { id: 'in-slew-in',    x: jackColumn3X, y: jackRow6Y, connections: [] },
            { id: 'out-att1',      x: jackColumn4X, y: jackRow6Y, connections: [] },
            { id: 'out-att2',      x: jackColumn5X, y: jackRow6Y, connections: [] },
            { id: 'out-slew',      x: jackColumn6X, y: jackRow6Y, connections: [] },

            { id: 'in-sum-1-a',    x: jackColumn0X, y: jackRow7Y, connections: [] },
            { id: 'in-sum-1-b',    x: jackColumn1X, y: jackRow7Y, connections: [] },
            { id: 'in-sum-2-a',    x: jackColumn2X, y: jackRow7Y, connections: [] },    
            { id: 'in-sum-2-b',    x: jackColumn3X, y: jackRow7Y, connections: [] },
            { id: 'out-sum1',      x: jackColumn4X, y: jackRow7Y, connections: [] },
            { id: 'out-sum2',      x: jackColumn5X, y: jackRow7Y, connections: [] },
            { id: 'out-assign',    x: jackColumn6X, y: jackRow7Y, connections: [] },
        ]
    };
    
    const container = document.getElementById('synth-container');
    const synthImage = document.getElementById('synth-image');
    const savePresetBtn = document.getElementById('save-preset');
    const loadPresetBtn = document.getElementById('load-preset');
    const presetFileInput = document.getElementById('preset-file');
    
    let cables = [];
    let activeJack = null;

    // audio vars
    let audioContext;
    let audioBuffer = null;
    let audioSource = null;
    let audioFileName = '';
    let audioFileType = '';
    let currentAudioData = null; // Will store base64 encoded audio
    
    // Initialize the synthesizer UI
    function initSynth() {
        initAudio();

        // Create knobs
        synthConfig.knobs.forEach(knobConfig => {
            const knob = document.createElement('div');
            knob.className = 'knob';
            knob.id = knobConfig.id;
            
            const marker = document.createElement('div');
            marker.className = 'knob-marker';
            
            knob.appendChild(marker);
            container.appendChild(knob);
            
            updateKnobPosition(knob, knobConfig);
            updateKnobRotation(knob, knobConfig.value);
            
            // Add event listeners for knob rotation
            let isDragging = false;
            let startAngle = 0;
            let startValue = knobConfig.value;
            
            knob.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = knob.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                startValue = knobConfig.value;
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const rect = knob.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                const angleDiff = currentAngle - startAngle;
                
                // Normalize angle difference to 0-1 range (270 degrees range)
                // let newValue = startValue + (angleDiff / 270);
                const shift = 0.01 * -e.movementY;
                let newValue = knobConfig.value + shift;
                newValue = Math.max(0, Math.min(1, newValue));
                
                knobConfig.value = newValue;
                updateKnobRotation(knob, newValue);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });

        // Add this to your initSynth() function
        function initAudio() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            document.getElementById('add-audio').addEventListener('click', () => {
                document.getElementById('audio-file').click();
            });
            
            document.getElementById('audio-file').addEventListener('change', handleAudioUpload);
            document.getElementById('play-audio').addEventListener('click', playAudio);
            document.getElementById('stop-audio').addEventListener('click', stopAudio);
        }

        async function handleAudioUpload(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            audioFileName = file.name;
            audioFileType = file.type;
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                
                document.getElementById('audio-info').textContent = file.name;
                document.getElementById('play-audio').disabled = false;
                document.getElementById('stop-audio').disabled = false;
                
                // Store the audio data as base64 for saving in preset
                const reader = new FileReader();
                reader.onload = (event) => {
                    // This will be stored in the preset
                    currentAudioData = event.target.result.split(',')[1];
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error("Error loading audio:", error);
                alert("Error loading audio file");
            }
        }

        function playAudio() {
            if (!audioBuffer) return;
            
            stopAudio();
            
            audioSource = audioContext.createBufferSource();
            audioSource.buffer = audioBuffer;
            audioSource.connect(audioContext.destination);
            audioSource.start();
        }

        function stopAudio() {
            if (audioSource) {
                audioSource.stop();
                audioSource = null;
            }
        }
                
        // Create buttons
        synthConfig.buttons.forEach(buttonConfig => {
            const button = document.createElement('div');
            button.className = 'button';
            button.id = buttonConfig.id;
            
            if (buttonConfig.state) {
                button.classList.add('on');
            }
            
            container.appendChild(button);
            updateButtonPosition(button, buttonConfig);
            
            button.addEventListener('click', () => {
                buttonConfig.state = !buttonConfig.state;
                button.classList.toggle('on');
            });
        });
        
        // Create jacks
        synthConfig.jacks.forEach(jackConfig => {
            const jack = document.createElement('div');
            jack.className = 'jack';
            jack.id = jackConfig.id;
            
            container.appendChild(jack);
            updateJackPosition(jack, jackConfig);
            
            jack.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                
                if (activeJack) {
                    // Complete the connection
                    if (activeJack !== jackConfig.id) {
                        // Check if connection already exists
                        const existingConnection = jackConfig.connections.includes(activeJack);
                        
                        if (!existingConnection) {
                            jackConfig.connections.push(activeJack);
                            
                            // Add reverse connection
                            const otherJack = synthConfig.jacks.find(j => j.id === activeJack);
                            if (otherJack && !otherJack.connections.includes(jackConfig.id)) {
                                otherJack.connections.push(jackConfig.id);
                            }
                            
                            updateConnections();
                        } else {
                            // Remove connection if it exists
                            jackConfig.connections = jackConfig.connections.filter(id => id !== activeJack);
                            
                            // Remove reverse connection
                            const otherJack = synthConfig.jacks.find(j => j.id === activeJack);
                            if (otherJack) {
                                otherJack.connections = otherJack.connections.filter(id => id !== jackConfig.id);
                            }
                            
                            updateConnections();
                        }
                    }
                    
                    document.querySelectorAll('.jack').forEach(j => j.classList.remove('active'));
                    activeJack = null;
                } else {
                    // Start a new connection
                    activeJack = jackConfig.id;
                    jack.classList.add('active');
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', updateAllPositions);
    }
    
    // Update positions of all elements based on container size
    function updateAllPositions() {
        synthConfig.knobs.forEach(knobConfig => {
            const knob = document.getElementById(knobConfig.id);
            if (knob) updateKnobPosition(knob, knobConfig);
        });
        
        synthConfig.buttons.forEach(buttonConfig => {
            const button = document.getElementById(buttonConfig.id);
            if (button) updateButtonPosition(button, buttonConfig);
        });
        
        synthConfig.jacks.forEach(jackConfig => {
            const jack = document.getElementById(jackConfig.id);
            if (jack) updateJackPosition(jack, jackConfig);
        });
        
        updateConnections();
    }
    
    function updateKnobPosition(knob, config) {
        const containerRect = container.getBoundingClientRect();
        knob.style.left = `${config.x * containerRect.width}px`;
        knob.style.top = `${config.y * containerRect.height}px`;
    }
    
    function updateButtonPosition(button, config) {
        const containerRect = container.getBoundingClientRect();
        button.style.left = `${config.x * containerRect.width}px`;
        button.style.top = `${config.y * containerRect.height}px`;
    }
    
    function updateJackPosition(jack, config) {
        const containerRect = container.getBoundingClientRect();
        jack.style.left = `${config.x * containerRect.width - 6}px`;
        jack.style.top = `${config.y * containerRect.height - 6}px`;
    }
    
    function updateKnobRotation(knob, value) {
        // Convert value (0-1) to rotation (-152 to 152 degrees)
        const rotation = (value * 304) - 152;
        knob.style.transform = `rotate(${rotation}deg)`;
    }
    
    function updateConnections() {
        // Remove all existing cables
        document.querySelectorAll('.cable').forEach(el => el.remove());
        cables = [];
        
        // Define a color palette for the wires
        const wireColors = [
            'rgba(255, 50, 50, 0.7)',    // Red
            'rgba(50, 255, 50, 0.7)',    // Green
            'rgba(50, 50, 255, 0.7)',    // Blue
            'rgba(255, 255, 50, 0.7)',   // Yellow
            'rgba(255, 50, 255, 0.7)',   // Magenta
            'rgba(50, 255, 255, 0.7)'    // Cyan
        ];
        
        // Update jack states
        synthConfig.jacks.forEach(jackConfig => {
            const jack = document.getElementById(jackConfig.id);
            if (jackConfig.connections.length > 0) {
                jack.classList.add('connected');
            } else {
                jack.classList.remove('connected');
            }
        });
        
        // Create new cables for all connections
        synthConfig.jacks.forEach((jackConfig, jackIndex) => {
            const fromJack = document.getElementById(jackConfig.id);
            const fromRect = fromJack.getBoundingClientRect();
            const fromX = fromRect.left + fromRect.width / 2;
            const fromY = fromRect.top + fromRect.height / 2;
            
            jackConfig.connections.forEach((connectionId, connIndex) => {
                const toJack = document.getElementById(connectionId);
                if (toJack) {
                    const toRect = toJack.getBoundingClientRect();
                    const toX = toRect.left + toRect.width / 2;
                    const toY = toRect.top + toRect.height / 2;
                    
                    // Create cable element
                    const cable = document.createElement('div');
                    cable.className = 'cable';
                    
                    // Assign a color based on connection index to make it consistent
                    const colorIndex = (jackIndex + connIndex) % wireColors.length;
                    cable.style.borderColor = wireColors[colorIndex];
                    cable.style.backgroundColor = wireColors[colorIndex];
                    
                    // Choose between straight or curved cable randomly
                    const useCurved = Math.random() > 0.5;
                    
                    if (false) {
                        cable.classList.add('curved');
                        createCurvedCable(cable, fromX, fromY, toX, toY, wireColors[colorIndex]);
                    } else {
                        createStraightCable(cable, fromX, fromY, toX, toY);
                    }
                    
                    container.appendChild(cable);
                    cables.push(cable);
                }
            });
        });
    }

    function createStraightCable(cable, fromX, fromY, toX, toY) {
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
        
        const containerRect = container.getBoundingClientRect();
        const relativeFromX = fromX - containerRect.left;
        const relativeFromY = fromY - containerRect.top;
        
        cable.style.width = `${length}px`;
        cable.style.left = `${relativeFromX}px`;
        cable.style.top = `${relativeFromY}px`;
        cable.style.transform = `rotate(${angle}deg)`;
    }

    function createCurvedCable(cable, fromX, fromY, toX, toY, color) {
        const containerRect = container.getBoundingClientRect();
        const relativeFromX = fromX - containerRect.left;
        const relativeFromY = fromY - containerRect.top;
        const relativeToX = toX - containerRect.left;
        const relativeToY = toY - containerRect.top;
        
        // Calculate control point for the curve
        const controlX = (relativeFromX + relativeToX) / 2 + (relativeFromY - relativeToY) / 3;
        const controlY = (relativeFromY + relativeToY) / 2 + (relativeToX - relativeFromX) / 3;
        
        // Create SVG path for the curved cable
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute('width', containerRect.width);
        svg.setAttribute('height', containerRect.height);
        svg.style.position = 'absolute';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.pointerEvents = 'none';
        
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute('d', `M${relativeFromX},${relativeFromY} Q${controlX},${controlY} ${relativeToX},${relativeToY}`);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        
        svg.appendChild(path);
        container.appendChild(svg);
        cables.push(svg);
    }

    function sanitizePath(path) {
        // Define a regex for common disallowed characters in Windows file paths:
        // \ / : * ? " < > |
        // The characters need to be escaped in the regex.
        const disallowedCharsRegex = '/[\\/:*?"<>|]/g'; 

        // Replace disallowed characters with a hyphen
        return path.replace(disallowedCharsRegex, '-');
    }

    // Save preset to JSON file
    savePresetBtn.addEventListener('click', () => {
        const preset = {
            meta: {
                author: document.getElementById('preset-author').value || 'Anonymous',
                number: parseInt(document.getElementById('preset-number').value) || 1,
                name: document.getElementById('preset-name').value || 'Unnamed Preset',
                date: new Date().toISOString()
            },
            knobs: synthConfig.knobs.map(k => ({ id: k.id, value: k.value })),
            buttons: synthConfig.buttons.map(b => ({ id: b.id, state: b.state })),
            jacks: synthConfig.jacks.map(j => ({ id: j.id, connections: j.connections })),
            audio: currentAudioData ? {
                name: audioFileName,
                type: audioFileType,
                data: currentAudioData
            } : null
        };
        
        const presetStr = JSON.stringify(preset, null, 2);
        const blob = new Blob([presetStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        let presetName = preset.meta.author + '_' + preset.meta.name;
        presetName = sanitizePath(presetName);
        if(presetName.length === 0)
            presetName = 'neutron-preset';
        a.download = presetName + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Load preset from JSON file
    loadPresetBtn.addEventListener('click', () => {
        presetFileInput.click();
    });

    // Complete loadPreset function
    async function loadPreset(presetData) {
        try {
            // Parse the preset data (if it's a string)
            const preset = typeof presetData === 'string' ? JSON.parse(presetData) : presetData;

            // Load metadata
            if (preset.meta) {
                document.getElementById('preset-author').value = preset.meta.author || '';
                document.getElementById('preset-number').value = preset.meta.number || 1;
                document.getElementById('preset-name').value = preset.meta.name || '';
                document.getElementById('preset-date').innerText = preset.meta.date || '';
            } else {
                // Default values if loading old preset without metadata
                document.getElementById('preset-author').value = '';
                document.getElementById('preset-number').value = 1;
                document.getElementById('preset-name').value = '';
                document.getElementById('preset-date').value = '';
            }

            // Load knobs
            preset.knobs.forEach(presetKnob => {
                const knobConfig = synthConfig.knobs.find(k => k.id === presetKnob.id);
                if (knobConfig) {
                    knobConfig.value = presetKnob.value;
                    const knobElement = document.getElementById(knobConfig.id);
                    if (knobElement) {
                        updateKnobRotation(knobElement, knobConfig.value);
                    }
                }
            });

            // Load buttons
            preset.buttons.forEach(presetButton => {
                const buttonConfig = synthConfig.buttons.find(b => b.id === presetButton.id);
                if (buttonConfig) {
                    buttonConfig.state = presetButton.state;
                    const buttonElement = document.getElementById(buttonConfig.id);
                    if (buttonElement) {
                        buttonElement.classList.toggle('on', buttonConfig.state);
                    }
                }
            });

            // Load jacks and connections
            synthConfig.jacks.forEach(jackConfig => {
                jackConfig.connections = [];
            });
            
            preset.jacks.forEach(presetJack => {
                const jackConfig = synthConfig.jacks.find(j => j.id === presetJack.id);
                if (jackConfig) {
                    jackConfig.connections = [...presetJack.connections];
                }
            });

            updateConnections();

            // Load audio if it exists in the preset
            if (preset.audio) {
                currentAudioData = preset.audio.data;
                audioFileName = preset.audio.name || 'sample';
                audioFileType = preset.audio.type || 'audio/mpeg';
                try {
                    const byteString = atob(preset.audio.data);
                    const arrayBuffer = new ArrayBuffer(byteString.length);
                    const uintArray = new Uint8Array(arrayBuffer);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        uintArray[i] = byteString.charCodeAt(i);
                    }
                    
                    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    audioFileName = preset.audio.name;
                    audioFileType = preset.audio.type;
                    
                    document.getElementById('audio-info').textContent = preset.audio.name;
                    document.getElementById('play-audio').disabled = false;
                    document.getElementById('stop-audio').disabled = false;
                } catch (error) {
                    console.error("Error loading audio from preset:", error);
                }
            } else {
                audioBuffer = null;
                document.getElementById('audio-info').textContent = "No sample loaded";
                document.getElementById('play-audio').disabled = true;
                document.getElementById('stop-audio').disabled = true;
            }

            console.log("Preset loaded successfully");
        } catch (error) {
            console.error("Error loading preset:", error);
            alert("Error loading preset: " + error.message);
        }
    }
    
    // This should already exist in your code
    presetFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const preset = JSON.parse(event.target.result);
                loadPreset(preset);
            } catch (error) {
                alert("Error loading preset file: " + error.message);
            }
        };
        reader.readAsText(file);
    });
    
    // Initialize the synthesizer
    initSynth();
});