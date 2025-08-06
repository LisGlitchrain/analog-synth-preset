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


## Sample use

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

## Modifications for another synthesizers

To use with another synth several changes are needed in 'synth-preset-handler.js':
- Adjust 'getDefaultConfig' method so that controls are mirorring those on a target
- Set image's width and height in method 'connectedCallback' ('#synth-container' css style in template)

It is also desired to change synth-background.jpg or path to image can be modified in 'synth-preset-handler.js'.


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