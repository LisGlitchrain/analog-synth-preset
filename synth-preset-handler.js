class SynthPresetHandler extends HTMLElement {
    constructor() {
        super();
        this.isTrilium = this.getAttribute('isTrilium') || false;
        this.defineSynthConfig();
        this.defineVariables();
  
        // Shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        this.connectedCallback();
        this.m_isInitialized = true;
    }

    defineVariables()
    {
        this.cables = [];
        this.activeJack = null;

        // DOM elements cache
        this.elements = {};

        // audio vars
        this.audioContext;
        this.audioBuffer = null;
        this.audioSource = null;
        this.audioFileName = '';
        this.audioFileType = '';
        this.currentAudioData = null; // Will store base64 encoded audio
        this.api = window.api;
        this.currentNote = null;
    }

    defineSynthConfig()
    {
        //SYNTH CONFIG (KNOBS, BUTTONS, JACKS)
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
        this.synthConfig = {
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
    }

    get isInitialized()
    {
        return this.m_isInitialized;
    }

    connectedCallback() {
        let template = `
        <style scoped>
        #synth-container {
            position: relative;
            width: 1217px;
            height: 671px;
            margin: 0 auto;
            border: 1px solid #444;
            background-color: #111;

            #synth-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .knob {
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transform-origin: center;
            }
            
            .knob-marker {
                position: absolute;
                width: 3px;
                height: 30px;
                background-color: red;
                top: -5px;
                /* top: -55px; */
                left: 50%;
                transform: translateX(-50%);
            }
            
            .synth-button {
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: rgba(255, 0, 0, 0.5);
                cursor: pointer;
            }
            
            .synth-button.on {
                background-color: rgba(0, 255, 0, 0.7);
            }
            
            .jack {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: rgba(0, 0, 255, 0.5);
                cursor: pointer;
            }
            
            .jack.connected {
                background-color: rgba(255, 255, 0, 0.7);
            }

            /* Ensure interactive elements stay on top */
            .knob, .button, .synth-button, .jack {
                z-index: 20; /* Higher than meta overlay */
            }
                    
            .cable {
                position: absolute;
                height: 4px;
                background-color: rgba(255, 0, 0, 0.6);
                pointer-events: none;
                border-radius: 2px;
                transform-origin: 0 50%;
                z-index: 10;
            }

            /* Curved cable style */
            .cable.curved {
                height: 2px;
                background: none;
                border-radius: 0;
            }

            .cable.curved::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-top: 2px solid;
                border-color: inherit;
                border-radius: 50%;
                transform: rotate(180deg);
            }
            
            #controls {
                position: absolute;
                left: 30%;
                top: 1.5%;
                /* margin: 20px auto; */
                width: 50%;
                height: 7%;
                text-align: left;
            }
            
            #comboAttachments{
                position: absolute;
                left: 45%;
                width: 30%;
                height: 100%;
                text-align: left;
                padding: 0.5%;
                background: #333;
                border-radius: 5px;
                color: #FFFFFF;
            }

            option {
                color: #FFFFFF;
            }

            button {
                padding: 8px 16px;
                margin: 0 5px;
                background-color: #444;
                color: white;
                border: none;
                height: 100%;
                width: 20%;
                border-radius: 4px;
                cursor: pointer;
            }
        
            
            button:hover {
                background-color: #555;
            }

            #audio-controls {
                position: absolute;
                top: 32%;
                left: 0.5%;
                width: 97.8%;
                height: 8%;
                text-align: left;
                padding: 0.5%;
                background: #333;
                border-radius: 5px;
            }

            #audio-controls button {
                height: 100%;
                width: 10%;
                margin: 0 5px;
                padding: 5px 0px;
            }

            #audio-info {
                display: inline-block;
                margin-left: 10px;
                color: #aaa;
                font-size: 0.9em;
                max-width: 60%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
            }

            /* Position the overlay absolutely within the synth container */
            #preset-meta-overlay {
                position: absolute;
                top: 0%;  /* Adjust these values to position */
                left: 0%; /* where you want on the image */
                display: flex;
                gap: 15px;
                z-index: 10; /* Above image but below interactive elements */
                background: rgba(30, 30, 30, 0.8);
                /* padding: 10px; */
                /* border-radius: 5px; */
                /* border: 1px solid rgba(255, 255, 255, 0.1); */
            }

            .meta-field {
                display: flex;
                flex-direction: column;
            }

            .meta-field label {
                font-size: 0.8em;
                margin-bottom: 3px;
                color: #ccc;
            }

            .meta-field input {
                padding: 5px 8px;
                background: rgba(60, 60, 60, 0.8);
                border: 1px solid #444;
                border-radius: 3px;
                color: white;
                font-size: 0.9em;
                min-width: 120px;
            }

            #preset-date {
                position:absolute;
                top: 14%;
                left: 5%;
                z-index: 10;
                font-size: 1.0em;
                border: 0px solid #444;
                color: #111;
                width: 18%;
            }

            #preset-author {
                position:absolute;
                top: 13.5%;
                left: 29%;
                z-index: 10;
                font-size: 1.1em;
                border: 0px solid #444;
                width: 13.5%;
                max-width: 13.5%;
            }

            #preset-name{
                position:absolute;
                top: 13.5%;
                left: 48%;
                font-size: 1.1em;
                border: 0px solid #444;
                width: 50%;
                max-width: 50%;
            }
            #preset-notes{
                position:absolute;
                top: 20%;
                left: 6%;
                font-size: 1.1em;
                border: 0px solid #444;
                width: 92%;
                height: 10%;
                max-width: 92%;
            }

            #preset-number {
                position: absolute;
                top: 3.5%;
                right: 1.5%;
                width: 8%;
                font-size: 1.1em;
                border: 0px solid #444;
                max-width: 10%;
            }

        }
        </style>
        
        <div id="synth-container">
            <!-- Background image of the synthesizer -->
            <img id="synth-image" src="synth-background.jpg" alt="Synthesizer">
            <!-- Metadata -->
            <span id="preset-date" placeholder=""></span>  
            <input type="text" id="preset-author" placeholder="Author name">
            <input type="number" id="preset-number" min="1" value="1">
            <input type="text" id="preset-name" placeholder="Preset name">
            <textarea type="text" id="preset-notes" placeholder=""></textarea>
            
            <div id="controls">
                <button id="save-preset">Save Preset</button>
                <button id="load-preset">Load Preset</button>
                <input type="file" id="preset-file" accept=".json" style="display: none;">
            </div>

            <div id="audio-controls">
                <button id="audio-add">Add Audio Sample</button>
                <input type="file" id="audio-file" accept=".mp3,.ogg,.wav" style="display: none;">
                <button id="audio-play" disabled>Play Sample</button>
                <button id="audio-stop" disabled>Stop Sample</button>
                <span id="audio-info">No sample loaded</span>
            </div>

            <!-- Knobs, buttons and jacks will be added dynamically -->
        </div>
        `;
        
        if(this.isTrilium)
        {
            template = template.replace('synth-background.jpg', "http://127.0.0.1:37840/custom/synth/synth-background.jpg");
            template = template.replace('<input type="file" id="preset-file" accept=".json" style="display: none;">', '<input type="file" id="preset-file" accept=".json" style="display: none;"><select id="comboAttachments" title="Select file from attachment, subtree notes or custom resource to load."></select>');
        }
        this.shadowRoot.innerHTML = template;

        // Initialize components
        this.cacheHTMLElements();
        this.initAudio();
        this.initSynth();
        this.initEventListeners();
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.elements.audioAdd.addEventListener('click', () => {
                this.elements.audioFileInput.click();
            });
        this.elements.audioFileInput.addEventListener('change', this.handleAudioUpload.bind(this));
        this.elements.audioPlay.addEventListener('click', this.playAudio.bind(this));
        this.elements.audioStop.addEventListener('click', this.stopAudio.bind(this));
    }
  
    async decodeAudioData(dataURL) {
        try {
            const response = await fetch(dataURL);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Update UI
            this.elements.audioInfo.textContent = this.audioFileName;
            this.elements.audioPlay.disabled = false;
            this.elements.audioStop.disabled = false;
        } catch (error) {
            console.error("Error decoding audio:", error);
        }
    }

    cacheHTMLElements()
    {
        // Cache DOM elements
        this.elements = {
            synthImage:       this.shadowRoot.getElementById('synth-image'),
            synthContainer:   this.shadowRoot.getElementById('synth-container'),
            //container:        this.shadowRoot.getElementById('synth-container'),
            //Meta controls
            presetAuthor:     this.shadowRoot.getElementById('preset-author'),
            presetNumber:     this.shadowRoot.getElementById('preset-number'),
            presetName:       this.shadowRoot.getElementById('preset-name'),
            presetDate:       this.shadowRoot.getElementById('preset-date'),
            presetNotes:      this.shadowRoot.getElementById('preset-notes'),
            //Preset controls
            savePresetBtn:    this.shadowRoot.getElementById('save-preset'),
            loadPresetBtn:    this.shadowRoot.getElementById('load-preset'),
            presetFileInput:  this.shadowRoot.getElementById('preset-file'),
            presetComboAttachment: this.shadowRoot.getElementById('comboAttachments'),
            //Audio controls
            audioFileInput:   this.shadowRoot.getElementById('audio-file'),
            audioAdd:         this.shadowRoot.getElementById('audio-add'),
            audioInfo:        this.shadowRoot.getElementById('audio-info'),
            audioPlay:        this.shadowRoot.getElementById('audio-play'),
            audioStop:        this.shadowRoot.getElementById('audio-stop'),
        };
    }

    // Initialize the synthesizer UI
    initSynth() {
        this.elements.synthContainer.querySelectorAll('.knob').forEach(el => el.remove());
        this.elements.synthContainer.querySelectorAll('.synth-button').forEach(el => el.remove());
        this.elements.synthContainer.querySelectorAll('.jack').forEach(el => el.remove());

        // Create knobs
        this.synthConfig.knobs.forEach(knobConfig => {
            const knob = document.createElement('div');
            knob.className = 'knob';
            knob.id = knobConfig.id;
            knob.title = knobConfig.id;
            
            const marker = document.createElement('div');
            marker.className = 'knob-marker';
            
            knob.appendChild(marker);
            this.elements.synthContainer.appendChild(knob);
            
            this.updateKnobPosition(knob, knobConfig);
            this.updateKnobRotation(knob, knobConfig.value);
            
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

                const shift = 0.01 * -e.movementY;
                let newValue = knobConfig.value + shift;
                newValue = Math.max(0, Math.min(1, newValue));
                
                knobConfig.value = newValue;
                this.updateKnobRotation(knob, newValue);
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
   
        // Create buttons
        this.synthConfig.buttons.forEach(buttonConfig => {
            const button = document.createElement('div');
            button.className = 'synth-button';
            button.id = buttonConfig.id;
            button.title = buttonConfig.id;

            if (buttonConfig.state) {
                button.classList.add('on');
            }
            
            this.elements.synthContainer.appendChild(button);
            this.updateButtonPosition(button, buttonConfig);
            
            button.addEventListener('click', () => {
                buttonConfig.state = !buttonConfig.state;
                button.classList.toggle('on');
            });
        });
        
        // Create jacks
        this.synthConfig.jacks.forEach(jackConfig => {
            const jack = document.createElement('div');
            jack.className = 'jack';
            jack.id = jackConfig.id;
            jack.title = jackConfig.id;

            this.elements.synthContainer.appendChild(jack);
            this.updateJackPosition(jack, jackConfig);
            
            jack.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                
                if (this.activeJack) {
                    // Complete the connection
                    if (this.activeJack !== jackConfig.id) {
                        // Check if connection already exists
                        const existingConnection = jackConfig.connections.includes(this.activeJack);
                        
                        if (!existingConnection) {
                            jackConfig.connections.push(this.activeJack);
                            
                            // Add reverse connection
                            const otherJack = this.synthConfig.jacks.find(j => j.id === this.activeJack);
                            if (otherJack && !otherJack.connections.includes(jackConfig.id)) {
                                otherJack.connections.push(jackConfig.id);
                            }
                            
                            this.updateConnections();
                        } else {
                            // Remove connection if it exists
                            jackConfig.connections = jackConfig.connections.filter(id => id !== this.activeJack);
                            
                            // Remove reverse connection
                            const otherJack = this.synthConfig.jacks.find(j => j.id === this.activeJack);
                            if (otherJack) {
                                otherJack.connections = otherJack.connections.filter(id => id !== jackConfig.id);
                            }
                            
                            this.updateConnections();
                        }
                    }
                    
                    document.querySelectorAll('.jack').forEach(j => j.classList.remove('active'));
                    this.activeJack = null;
                } else {
                    // Start a new connection
                    this.activeJack = jackConfig.id;
                    jack.classList.add('active');
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', this.updateAllPositions);
    }

    initEventListeners() {
        // This should already exist in your code
        this.elements.presetFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const preset = JSON.parse(event.target.result);
                    this.loadPreset(preset);
                } catch (error) {
                    alert("Error loading preset file: " + error.message);
                }
            };
            reader.readAsText(file);
        });

        // Load preset from JSON file
        this.elements.loadPresetBtn.addEventListener('click', () => {
            this.elements.presetFileInput.click();
        });

        // Save preset to JSON file
        this.elements.savePresetBtn.addEventListener('click', () => {
            const preset = {
                meta: {
                    author: this.elements.presetAuthor.value || 'Anonymous',
                    number: parseInt(this.elements.presetNumber.value) || 1,
                    name: this.elements.presetName.value || 'Unnamed Preset',
                    notes: this.elements.presetNotes.value || '',
                    date: new Date().toISOString()
                },
                knobs: this.synthConfig.knobs.map(k => ({ id: k.id, value: k.value })),
                buttons: this.synthConfig.buttons.map(b => ({ id: b.id, state: b.state })),
                jacks: this.synthConfig.jacks.map(j => ({ id: j.id, connections: j.connections })),
                audio: this.currentAudioData ? {
                    name: this.audioFileName,
                    type: this.audioFileType,
                    data: this.currentAudioData
                } : null
            };

            let presetName = preset.meta.author + '_' + preset.meta.name;
            presetName = this.sanitizePath(presetName);
            if(presetName.length === 0)
                presetName = 'neutron-preset';
            presetName = presetName + '.ntr';
            
            const presetStr = JSON.stringify(preset, null, 2);
            if(this.isTrilium)
            {
                const parentNote = api.getActiveContextNote();      
                this.api.runOnBackend((parentId, presetName, jsonString) =>
                    {
                        // Create a new note with the JSON content
                        const newNote = api.createNewNote({
                            parentNoteId: parentId,
                            title: presetName, // Name it as a JSON file
                            type: "file", // Important for file downloads
                            mime: "application/x-neutron-preset-json", // Set MIME type
                            content: jsonString, // The actual JSON data
                        }); 
                    }, [parentNote.noteId, presetName, presetStr]);
            }
            else
            {
                const blob = new Blob([presetStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = presetName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                console.log("URL to download: " + url);
                URL.revokeObjectURL(url);
            }
        });
    }

    // Update positions of all elements based on container size
    updateAllPositions() {
        this.synthConfig.knobs.forEach(knobConfig => {
            const knob = this.shadowRoot.getElementById(knobConfig.id);
            if (knob) this.updateKnobPosition(knob, knobConfig);
        });
        
        this.synthConfig.buttons.forEach(buttonConfig => {
            const button = this.shadowRoot.getElementById(buttonConfig.id);
            if (button) this.updateButtonPosition(button, buttonConfig);
        });
        
        this.synthConfig.jacks.forEach(jackConfig => {
            const jack = this.shadowRoot.getElementById(jackConfig.id);
            if (jack) this.updateJackPosition(jack, jackConfig);
        });
        
        this.updateConnections();
    }

    updateKnobPosition(knob, config) {
        const containerRect = this.elements.synthContainer.getBoundingClientRect();
        knob.style.left = `${config.x * containerRect.width}px`;
        knob.style.top = `${config.y * containerRect.height}px`;
    }
    
    updateButtonPosition(button, config) {
        const containerRect = this.elements.synthContainer.getBoundingClientRect();
        button.style.left = `${config.x * containerRect.width}px`;
        button.style.top = `${config.y * containerRect.height}px`;
    }
    
    updateJackPosition(jack, config) {
        const containerRect = this.elements.synthContainer.getBoundingClientRect();
        jack.style.left = `${config.x * containerRect.width - 6}px`;
        jack.style.top = `${config.y * containerRect.height - 6}px`;
    }
    
    updateKnobRotation(knob, value) {
        // Convert value (0-1) to rotation (-152 to 152 degrees)
        const rotation = (value * 304) - 152;
        knob.style.transform = `rotate(${rotation}deg)`;
    }

    updateConnections() {
        // Remove all existing cables
        this.elements.synthContainer.querySelectorAll('.cable').forEach(el => el.remove());
        this.cables = [];
        
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
        this.synthConfig.jacks.forEach(jackConfig => {
            const jack = this.shadowRoot.getElementById(jackConfig.id);
            if (jackConfig.connections.length > 0) {
                jack.classList.add('connected');
            } else {
                jack.classList.remove('connected');
            }
        });
        
        // Create new cables for all connections
        this.synthConfig.jacks.forEach((jackConfig, jackIndex) => {
            const fromJack = this.shadowRoot.getElementById(jackConfig.id);
            const fromRect = fromJack.getBoundingClientRect();
            const fromX = fromRect.left + fromRect.width / 2;
            const fromY = fromRect.top + fromRect.height / 2;
            
            jackConfig.connections.forEach((connectionId, connIndex) => {
                const toJack = this.shadowRoot.getElementById(connectionId);
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
                        this.createCurvedCable(cable, fromX, fromY, toX, toY, wireColors[colorIndex]);
                    } else {
                        this.createStraightCable(cable, fromX, fromY, toX, toY);
                    }
                    
                    this.elements.synthContainer.appendChild(cable);
                    this.cables.push(cable);
                }
            });
        });
    }

    createStraightCable(cable, fromX, fromY, toX, toY) {
        const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
        
        const containerRect = this.elements.synthContainer.getBoundingClientRect();
        const relativeFromX = fromX - containerRect.left;
        const relativeFromY = fromY - containerRect.top;
        
        cable.style.width = `${length}px`;
        cable.style.left = `${relativeFromX}px`;
        cable.style.top = `${relativeFromY}px`;
        cable.style.transform = `rotate(${angle}deg)`;
    }

    createCurvedCable(cable, fromX, fromY, toX, toY, color) {
        const containerRect = this.elements.synthContainer.getBoundingClientRect();
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
        this.elements.synthContainer.appendChild(svg);
        this.cables.push(svg);
    }

    sanitizePath(path) {
        // Define a regex for common disallowed characters in Windows file paths:
        // \ / : * ? " < > |
        // The characters need to be escaped in the regex.
        const disallowedCharsRegex = '/[\\/:*?"<>|]/g'; 

        // Replace disallowed characters with a hyphen
        return path.replace(disallowedCharsRegex, '-');
    }

    //Used to load preset from TriliumNext Notes
    async loadFileURL(url)
    {
        try {
            // First fetch the response
            const response = await fetch(url);

            // Check if the request was successful
            if (!response.ok) 
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse the response as JSON
            const jsonData = await response.json();
        this.loadPreset(jsonData);
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    }

    // Complete loadPreset function
    async loadPreset(presetData) {
        try {
            // Parse the preset data (if it's a string)
            const preset = typeof presetData === 'string' ? JSON.parse(presetData) : presetData;

            // Load metadata
            if (preset.meta) {
                this.elements.presetAuthor.value = preset.meta.author || '';
                this.elements.presetNumber.value = preset.meta.number || 1;
                this.elements.presetName.value = preset.meta.name || '';
                this.elements.presetDate.innerText = preset.meta.date || '';
                this.elements.presetNotes.value = preset.meta.notes || '';
            } else {
                // Default values if loading old preset without metadata
                this.elements.presetAuthor.value = '';
                this.elements.presetNumber.value = 1;
                this.elements.presetName.value = '';
                this.elements.presetDate.value = '';
                this.elements.presetNotes.value = '';
            }

            // Load knobs
            preset.knobs.forEach(knobFromPreset => {
                const knobConfig = this.synthConfig.knobs.find(k => k.id === knobFromPreset.id);
                if (knobConfig) {
                    knobConfig.value = knobFromPreset.value;
                    const knobElement = this.shadowRoot.getElementById(knobConfig.id);
                    if (knobElement) {
                        this.updateKnobRotation(knobElement, knobConfig.value);
                    }
                }
            });

            // Load buttons
            preset.buttons.forEach(synthButtonFromPreset => {
                const buttonConfig = this.synthConfig.buttons.find(b => b.id === synthButtonFromPreset.id);
                if (buttonConfig) {
                    buttonConfig.state = synthButtonFromPreset.state;
                    const buttonElement = this.shadowRoot.getElementById(buttonConfig.id);
                    if (buttonElement) {
                        buttonElement.classList.toggle('on', buttonConfig.state);
                    }
                }
            });

            // Load jacks and connections
            this.synthConfig.jacks.forEach(jackConfig => {
                jackConfig.connections = [];
            });
            
            preset.jacks.forEach(jackFromPreset => {
                const jackConfig = this.synthConfig.jacks.find(j => j.id === jackFromPreset.id);
                if (jackConfig) {
                    jackConfig.connections = [...jackFromPreset.connections];
                }
            });

            this.updateConnections();

            // Load audio if it exists in the preset
            if (preset.audio) {
                this.currentAudioData = preset.audio.data;
                this.audioFileName = preset.audio.name || 'sample';
                this.audioFileType = preset.audio.type || 'audio/mpeg';
                try {
                    const byteString = atob(preset.audio.data);
                    const arrayBuffer = new ArrayBuffer(byteString.length);
                    const uintArray = new Uint8Array(arrayBuffer);
                    
                    for (let i = 0; i < byteString.length; i++) {
                        uintArray[i] = byteString.charCodeAt(i);
                    }
                    
                    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    // this.audioFileName = preset.audio.name;
                    // this.audioFileType = preset.audio.type;
                    
                    this.elements.audioInfo.textContent = preset.audio.name;
                    this.elements.audioPlay.disabled = false;
                    this.elements.audioStop.disabled = false;
                } catch (error) {
                    console.error("Error loading audio from preset:", error);
                }
            } else {
                this.audioBuffer = null;
                this.elements.audioInfo.textContent = "No sample loaded";
                this.elements.audioPlay.disabled = true;
                this.elements.audioStop.disabled = true;
            }

            console.log("Preset loaded successfully");
        } catch (error) {
            console.error("Error loading preset:", error);
            alert("Error loading preset: " + error.message);
        }
    }
    
    async handleAudioUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        this.audioFileName = file.name;
        this.audioFileType = file.type;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            this.elements.audioInfo.textContent = file.name;
            this.elements.audioPlay.disabled = false;
            this.elements.audioStop.disabled = false;
            
            // Store the audio data as base64 for saving in preset
            const reader = new FileReader();
            reader.onload = (event) => {
                // This will be stored in the preset
                this.currentAudioData = event.target.result.split(',')[1];
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error loading audio:", error);
            alert("Error loading audio file");
        }
    }

    playAudio() {
        if (!this.audioBuffer) return;
        this.stopAudio();
        
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start();
    }

    stopAudio() {
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource = null;
        }
    }

    disconnectedCallback() {
        // Cleanup
        if (this.audioSource) {
            this.audioSource.stop();
        }
    }
}

// Register the custom element
customElements.define('synth-preset-handler', SynthPresetHandler);