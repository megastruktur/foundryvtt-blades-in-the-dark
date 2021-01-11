
Hooks.on('diceSoNiceReady', (dice3d) => {
  dice3d.addSystem({ id: "Wicked Dots", name: "Wicked Dots"},"exclusive");

   dice3d.addDicePreset({
	   type: "d6",
	   labels: [
       "../systems/wicked-ones/styles/assets/dice/dots/d6-1.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-2.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-3.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-4.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-5.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-6.png"	   
	   ],
	   bumpMaps: [
       "../systems/wicked-ones/styles/assets/dice/dots/d6-1-b.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-2-b.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-3-b.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-4-b.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-5-b.png",
       "../systems/wicked-ones/styles/assets/dice/dots/d6-6-b.png"	  
		],
		system: "Wicked Dots",
		colorset:"Wicked Dice"
   },"d6");

  dice3d.addSystem({ id: "Wicked Claws", name: "Wicked Claws"},"exclusive");

   dice3d.addDicePreset({
	   type: "d6",
	   labels: [
       "../systems/wicked-ones/styles/assets/dice/claws/d6-1.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-2.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-3.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-4.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-5.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-6.png"	   
	   ],
	   bumpMaps: [
       "../systems/wicked-ones/styles/assets/dice/claws/d6-1-b.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-2-b.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-3-b.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-4-b.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-5-b.png",
       "../systems/wicked-ones/styles/assets/dice/claws/d6-6-b.png"	  
		],
		system: "Wicked Claws"
   },"d6");   

      dice3d.addColorset({
        name: 'Wicked Dice',
        description: "Wicked Ones Style",
        category: "Wicked Ones",
		foreground: "#750000",
		background: "#d1d1d1",
		outline: "#cc0000",
        edge: '#707070',
		material: 'metal',
		font:"Didot",
		texture: "../systems/wicked-ones/styles/assets/dice/dots/texture.png",
      },"default");
    });