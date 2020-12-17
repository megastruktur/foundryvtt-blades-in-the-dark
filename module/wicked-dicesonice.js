
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

  // dice3d.addTexture("sun", {
    // name: "Worthy Metal",
    // composite: "multiply",
    // source: "modules/lordudice/graphics/dice/sun.png",
	// bump: "modules/lordudice/graphics/dice/sun.png"
  // })
    // .then(() => {
      // dice3d.addColorset({
        // name: 'LCD - Saviours Blessing',
        // description: "Saviours Blessing",
        // category: "LCD - Dark Deeds",
        // background: "#fff1bb",
		// foreground: '#ff870d',
		// outline: '#ff6b00',
        // edge: '#ffbf00',
		// texture: 'sun',
		// material: 'metal',
		// fontScale: {
          // "d100":0.8,
		  // "d20": 0.9,
          // "d12":1.0,
		  // "d10": 0.9,
		  // "d8": 0.9,
          // "d6":1.2,
          // "d2":1.3
        // },
        // font:"Metamorphous"
      // },"no");
    // });
	
});