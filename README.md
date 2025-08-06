`<synth-preset-handler>`
=================

This is a project to conveniently create, save and represent patches for analog synthesizers.
Current implementaion is about Behringer Neutron semi-modular synthesizer, but is can be configures for any other synth that consists of knobs, buttons, faders and patch cables.

## Capabilities

<img src="./.github/images/neutron-path-demo.gif" alt="demo of configuring patch for Neutron" height=696 width=1280>

- Draw adjustable knobs, buttons, faders and patch cables above synth image and also draw meta data
- Automatically timestamp preset
- Attach and playback audiofile (.wav, .mp3, .ogg)
- Save and load to and from json (.ntr)
- Show tooltips for synth controls. out jacks's tooltip shows not only jack name, but also connections
- Pressing 'shift' key while dragging knob will change adjustment sensitivity from coarse to fine
- Double click on knobs, buttons and faders will reset in to default value
- Double click on jack will remove connections if they are not default
- Works in local browser, in TriliumNext Notes as widget


## Usage

### In web page

```html
<!DOCTYPE html>
<html>
<head>
    <title>Synthesizer Preset Handler</title>
</head>
<body>
    <script src="synth-preset-handler.js"></script>
    <synth-preset-handler></synth-preset-handler>
</body>
</html>
```

### Bare project as is

- Download project
- Open 'index.html' with browser.

## Modifications for another synthesizers

To use with another synth several changes are needed in 'synth-preset-handler.js':
- Adjust 'getDefaultConfig' method so that controls are mirorring those on a target
- Set image's width and height in method 'connectedCallback' ('#synth-container' css style in template)

It is also desired to change synth-background.jpg or path to image can be modified in 'synth-preset-handler.js'.
Places to modify can be found via text search for 'MODIFYING' comment nearby.

### getDefaultConfig method example

In this example simple synthesizer is described (part of Neutron with extra faders).

```javascript
    // These positions are relative to the synth image dimensions
    // You'll need to adjust these based on your actual synth image
    knobs: [
        { id: 'osc1-tune',     x: 0.050,   y: 0.576, value: 0.5, minAngle: -152, maxAngle: 152 },
        { id: 'osc1-shape',    x: 0.050,   y: 0.730, value: 0.5, minAngle: -152, maxAngle: 152 },
        { id: 'osc1-width',    x: 0.050,   y: 0.862, value: 0.5, minAngle: -152, maxAngle: 152 },
        { id: 'osc2-tune',     x: 0.1685,  y: 0.576, value: 0.5, minAngle: -152, maxAngle: 152 },
        { id: 'osc2-shape',    x: 0.1685,  y: 0.730, value: 0.5, minAngle: -152, maxAngle: 152 },
        { id: 'osc2-width',    x: 0.1685,  y: 0.862, value: 0.5, minAngle: -152, maxAngle: 152 }
    ],
    
    buttons: [
        { id: 'osc1-range-8',                x: 0.108,  y: 0.655,  state: false },
        { id: 'osc1-range-16',               x: 0.108,  y: 0.687,  state: false },
        { id: 'osc1-range-32',               x: 0.108,  y: 0.721,  state: false },
        { id: 'osc2-range-8',                x: 0.1345, y: 0.655,  state: false },
        { id: 'osc2-range-16',               x: 0.1345, y: 0.687,  state: false },
        { id: 'osc2-range-32',               x: 0.1345, y: 0.721,  state: false },
        { id: 'osc-sync',                    x: 0.12,   y: 0.84,   state: false },
        { id: 'paraphonic',                  x: 0.12,   y: 0.9,    state: false },
        { id: 'vcf-mode-low-cut',            x: 0.235,  y: 0.54,   state: false },
        { id: 'vcf-mode-band-pass',          x: 0.235,  y: 0.568,  state: false },
        { id: 'vcf-mode-high-cut',           x: 0.235,  y: 0.596,  state: true  }
    ],
    
    jacks: [
        { id: 'in-osc1',       x: 0.7627,       y: 0.495, connections: [] },
        { id: 'in-osc2',       x: 0.7965666667, y: 0.495, connections: [] },
        { id: 'in-osc12',      x: 0.8304333333, y: 0.495, connections: [] },
        { id: 'in-invert-in',  x: 0.8643,       y: 0.495, connections: [] },
        { id: 'out-ocs1',      x: 0.8981666667, y: 0.495, connections: [] },
        { id: 'out-ocs2',      x: 0.9320333333, y: 0.495, connections: [] },
        { id: 'out-ocs-mix',   x: 0.9659,       y: 0.495, connections: [] }
    ],
    //Faders examples (not related to Behringer Neutron)
    faders: [
        { 
            id: "volume", 
            x: 0.3, 
            y: 0.3,
            length: 120,           // Pixel length
            direction: "vertical", // or "horizontal"
            default: 0.5,          // 0-1 range
            thickness: 15          // Optional (default: 15px)
        },
        { 
            id: "volume-2", 
            x: 0.5, 
            y: 0.3,
            length: 120,             // Pixel length
            direction: "horizontal", // or "horizontal"
            default: 0.2,            // 0-1 range
            thickness: 15            // Optional (default: 15px)
        }
    ]
```


If you want to add, for example, knob, just add line after 'osc2-width':
```javascript
,//don't forget coma!
 { id: 'new-osc',    x: 0.5,  y: 0.5, value: 0.5, minAngle: -90, maxAngle: 90 }
```
Knob described above will have id (name) 'new-osc', be located approx in the center of synth picture, have default value 0.5 and will be rotated from -90 to 90 degrees with 0 degree is directed up (relative to web page). It is possible to set minAngle greater than maxAngle and their sum can exceed 360 degrees.

Buttons and jacks have similar logic with knobs. But jacks have additional stuff: 'in' and 'out' parts at the beginning of the name have special role: it is possible to connect any jack to any other jack, but if 'in' and 'out' pair is forming, then it is guaranteed that 'out' jack's hint will have additional destination line. And in preset 'out' jack will have connections, not 'in' (for in-out pairs).

There are faders of two kinds: vertical and horizontal.

## TriliumNext Notes

Initial intent was to create and store patches in TriliumNext Notes app (working locally), so release contains notes that can be loaded into the app.

### Trilium Instructions

#### Prerequisites

Resources (scripts, notes) must be available at default Trilium's URL: http://127.0.0.1:37840/ If address differs, it needs adjustments in NeutronPresetWidgetNote and synth-preset-handler.js notes.

#### Installation

- Download .zip with latest release version of widget
- Select desired note in Trilium to append widget notes to
- Import notes
- Remove ‘disabled:’ from owned attributes in imported notes (not attributes! only ‘disabled:’ part)

#### Widget usage

Widget will appear when preset-note is selected (note type is ‘file’).

To use widget in other notes ('text' and ‘book’), set owned attribute ‘#neutronPresetWidget’

Presets can be loaded from disk with button or from Trilium with dropdown.

Dropdown is filled with presets found in current notes attachments and children notes. It is also possible to fill dropdown with notes by URL with 'customResourceProvide'r' attribute on target notes. (See ‘Examples’ note and also check attributes on them and ‘NeutronWidget’.)

From Trilium it is only possible to save note as a child file note. But it is possible to download it from Trilium interface to disk.

If modifications are needed, the process is  similar to plain web-version.