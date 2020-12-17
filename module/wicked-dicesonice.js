
Hooks.on('diceSoNiceReady', (dice3d) => {
  dice3d.addSystem({ id: "Wicked Ones", name: "Wicked Ones"},"exclusive");

   dice3d.addDicePreset({
	   type: "d6",
	   labels: [
       "../systems/wicked-ones/styles/assets/dice/d6-1.png",
       "../systems/wicked-ones/styles/assets/dice/d6-2.png",
       "../systems/wicked-ones/styles/assets/dice/d6-3.png",
       "../systems/wicked-ones/styles/assets/dice/d6-4.png",
       "../systems/wicked-ones/styles/assets/dice/d6-5.png",
       "../systems/wicked-ones/styles/assets/dice/d6-6.png"	   
	   ],
	   bumpMaps: [
       "../systems/wicked-ones/styles/assets/dice/d6-1-b.png",
       "../systems/wicked-ones/styles/assets/dice/d6-2-b.png",
       "../systems/wicked-ones/styles/assets/dice/d6-3-b.png",
       "../systems/wicked-ones/styles/assets/dice/d6-4-b.png",
       "../systems/wicked-ones/styles/assets/dice/d6-5-b.png",
       "../systems/wicked-ones/styles/assets/dice/d6-6-b.png"	  
		],
		system: "Wicked Ones"
   },"d6");

      dice3d.addColorset({
        name: 'Wicked Dice',
        description: "Wicked Ones Style",
        category: "Wicked Ones",
        edge: '#686859',
		material: 'metal',
      },"default");
    });