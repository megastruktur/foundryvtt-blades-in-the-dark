
Hooks.on('diceSoNiceReady', (dice3d) => {
  dice3d.addSystem({ id: "WhiteDots", name: "Wicked Dots"},"exclusive");
   dice3d.addDicePreset({
	   type: "d6",
	   labels: [
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-1.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-2.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-3.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-4.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-5.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-6.png"	   
	   ],
	   bumpMaps: [
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-1-b.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-2-b.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-3-b.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-4-b.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-5-b.png",
       "../systems/wicked-ones/styles/assets/dice/whitedots/d6-6-b.png"	  
		],
		system: "WhiteDots",
		colorset:"Wicked Dice"
   },"d6");

  dice3d.addSystem({ id: "BlackDots", name: "Wicked Dark Dots"},"exclusive");
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
		system: "BlackDots",
		colorset:"Wicked Dice"
   },"d6");

  dice3d.addSystem({ id: "Claws", name: "Wicked Claws"},"exclusive");

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
		system: "Claws",
		colorset:"Wicked Dice"
   },"d6");   

   dice3d.addSystem({ id: "Numbers", name: "Wicked Numbers"},"exclusive");
   dice3d.addDicePreset({
	   type: "d6",
	   labels: [
       "1",
       "2",
       "3",
       "4",
       "5",
       "6"	   
	   ],
	   	system: "Numbers",
	   	colorset:"Wicked Dice"
   },"d6");  

      dice3d.addColorset({
        name: 'Wicked Dice',
        description: "Wicked Style",
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