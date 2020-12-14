# FoundryVTT Wicked Ones character and dungeon sheets

For questions or reporting bugs contact on Discord: `Spearhead#4288` or `LorduFreeman#8747`

Based on the Blades in the Dark sheets by `megastruktur`.

## Usage
The module contains three "actor" types for Wicked Ones, Minion Packs and Dungeons with their own sheets

Most parts of the sheets can be filled in by selecting and customizing "items". Those consist of:
Callings, Defenses, Downtime Projects, Dungeon Rooms and Themes, Gear, Supply, Impulses, Monster Races, Revelries and more

- To reset XP, Gold and other counters just click on the label name
- The stress clock can be reset by clicking on "Stress" table header
- To add items you can click a corresponding link or drag items from the associated compendium to the sheet
- All "calling/theme" specific items are prefixed with first significant letters
- To see the description of a Calling, Dark Impulse, Ability, etc you can just click on the added item and see all the info in the popup
- When adding a new item you can hover a "question-mark" icon to see the item's description
- To add Custom abilities just add a new "Foundry Item" of the corresponding type and fill all the necessary info. Then drag it to the sheet or add via button on a sheet
- You can also change any information on items dragged to the sheet for customization

## Callings:
- B)  Brute
- Co) Conniver
- Cr) Crafter
- H)  Hunter
- M)  Marauder
- Sd) Shadow
- Sm) Shaman
- W)  Warlock
- Sp) Zealot

## Dungeon Themes:
- E) Enclave
- F) Forge
- H) Hideout
- S) Stronghold
- T) Temple


## Clocks
- To add clock go to Actors tab and create a new actor of type "🕛 Clock"
- To share it to other players just drag it to a scene

## Logic field

Logic field is a json with params which allows to implement some logic when the Item of corresponding type is added or removed.
### Example (from the Vault 1 crew upgrade)
`{"attribute":"data.vault.max","operator":"addition","value":4,"requirement":""}`
- `attribute` - the attribute to affect
- `operator` - what is done to attribute
- `value` - the value for operator
- `requirement` - is not used

### Operators list
- `addition` - is added when item is attached and substracted when removed
- `attribute_change` - changes the "attribute" to value and when removed - uses the "attribute_default" to restore

## To be done in the nearest future
- 
- 

## Troubleshooting
- If you can't find the drag-n-dropped item, refer to the "All" tab on each sheet

## Credits
- This work is based on Wicked Ones by Ben Nielson (found at http://b-design.io/)
- Wicked Ones is in turn basd on Blades in the Dark (found at http://www.bladesinthedark.com/), product of One Seven Design, developed and authored by John Harper, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

