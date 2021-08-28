# FoundryVTT Beam Saber pilot and Squad sheets

Everything is based off the Blades in the Dark system from megastruktur - https://github.com/megastruktur/foundryvtt-blades-in-the-dark
Currently everythign needs to be updated

## Usage
`"Item" - all classes, crew types, upgrades, items, abilities, upgrades, etc.`

- To reset reputation, exp, etc counters just click on the label name.
- Health clock can be reset by clicking on "Healing" table header.
- To add items you can click a corresponding link or drag items from compendium/game to the sheet.
- All "class/crew" specific items are prefixed with first letters

- I don't want the "class/crew items" to be prepopulated, so the pilot sheet contains less "compendium" info.
- To see the description of Class, Vice, Background, etc you can just click added item and see all the info in the popup.
- When adding a new item you can hower a "question-circle" icon to see the item's description.
- To add Custom abilities just add a new "Foundry Item" of the corresponding type and fill all the necessary info. Then drag it to the sheet or add via button on a sheet.

Classes:
- (C)  Cutter
- (G)  Ghost
- (H)  Hound
- (Hu) Hull
- (Le) Leech
- (Lu) Lurk
- (Sl) Slide
- (Sp) Spider
- (V)  Vampire
- (W)  Whisper

Crew Types:
- (A)  Assassins
- (B)  Bravos
- (C)  Cult
- (H)  Hawkers
- (Sh) Shadows
- (Sm) Smugglers

## Screenshots

### pilot Sheet, Crew Sheet and Class
![alt screen][screenshot_all]

### Compendium
![alt screen][screenshot_compendium]

### Rolls
![alt screen][screenshot_roll_1]
![alt screen][screenshot_roll_2]

## Clocks
Clocks are now here!
- To add clock go to Actors tab and create a new Actor of type "🕛 clock".
- To share it to other players just drag it to a scene.

### Operators list
- `addition` - is added when item is attached and substracted when removed
- `attribute_change` - changes the "attribute" to value and when removed - uses the "attribute_default" to restore

## To be done in the nearest future
- actually update everything

## Troubleshooting
- If you can't find the drag-n-dropped item, refer to "All Items" tab on each sheet.

## Credits
- This work is based on Beamsaber by Austin Ramsay which can be found here - https://austin-ramsay.itch.io/beamsaber
