# Wicked Ones Game System for FoundryVTT

For questions or reporting bugs contact us on Discord: `Spearhead#4288` or `LorduFreeman#8747`.

Based on the great Blades in the Dark system by `megastruktur`.

## Usage
The module contains six "actor" types: Wicked Ones, Minion Packs, Dungeons, Factions, Adventurer Parties and finally Clocks, each with their own customized styled sheets.

Most parts of these sheets can be filled in by selecting and customizing "items". Those consist of: Adventurers, Callings, Defenses, Downtime Projects, Dungeon Duties, Rooms and Themes, Gear, Supply, Impulses, Monster Races, Revelries and more.

Most of the items and content from the book can be found in the compendia, imported as usual and edit to entirely customize your game if you want to! No love for Strongholds? Just edit them until they fit your campaign theme. You want a new Calling with custom abilities? Easy to do, just make up new ones on the fly.

- To reset XP, Gold and other counters just click on the label name
- To add items you can click a corresponding link or drag items from the associated compendium to the sheet
- Many clickable parts of the sheet display additional information on hovering over them for a while, for example Gold, XP, Stress, Attributes or Shock.
- To see the description of a Calling, Dark Impulse, Ability, etc you can just click on the added item and see all the info in the popup
- When adding a new item you can hover over the "Question Mark" icon to see the item's description
- To add Custom abilities just add a new "Foundry Item" of the corresponding type and fill all the necessary info. Then drag it to the sheet or add via button on a sheet
- You can also change any information on items dragged to the sheet for customization
- Red dots on the appearing on mouse-over are used to empty bars or clocks
- Trash bins appearing on mouse-over are used to remove items like defenses or abilities from the sheet
- Enabling shock auto-applies a -1D modifier to the roll, but does not automatically clear after rolling
#### Actor Sheets
- Actions and Resistance Rolls are rolled by clicking the appropriate Action Attribute, opening a Roll Popup with further options
- Practice XP can be counted by clicking the first empty checkbox of each skill, filling it up until full.
#### Clocks
- To add clock go to Actors tab and create a new actor of type "🕛 Clock"
- To share it to other players just drag it to a scene
#### GM Rolls
- GM Rolls are done using the dice icon on the left side of the screen, last icon in the toolbar. Clicking pops up a Roll Prompt containing every type of role described in the book.

## Logic field
Logic field is a json with params which allows to implement some logic when the Item of corresponding type is added or removed.
#### Example (from the Vault 1 crew upgrade)
`{"attribute":"data.vault.max","operator":"addition","value":4,"requirement":""}`
- `attribute` - the attribute to affect
- `operator` - what is done to attribute
- `value` - the value for operator
- `requirement` - is not used
#### Operators list
- `addition` - is added when item is attached and substracted when removed
- `attribute_change` - changes the "attribute" to value and when removed - uses the "attribute_default" to restore

## To be done
- Adding pictures to this readme
- Graphical improvements

## To be done in the far future
- Add UA Content when it comes out (and after getting permission of course) ;)

## Troubleshooting
- If you can't find the drag-n-dropped item, refer to the "All" tab on each sheet

## Credits
- This work is based on Wicked Ones by Ben Nielson (http://b-design.io/) and Victor Costa, a huge **Thank You!** to both of them for letting us use the wonderful official written and graphical content from the book to fill our system with!
- Wicked Ones is based on Blades in the Dark (found at http://www.bladesinthedark.com/), product of One Seven Design, developed and authored by John Harper, and licensed for our use under the Creative Commons Attribution 3.0 Unported license (http://creativecommons.org/licenses/by/3.0/).

