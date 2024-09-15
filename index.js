
		let grid_view_toggle = false;

		function showGridBorder() {
			Array.from(document.getElementsByClassName("grid-cell")).forEach((e)=>{
				e.style.border = "2px groove rgba(0,0,0,0)"
			})
		}

		function hideGridBorder() {
		Array.from(document.getElementsByClassName("grid-cell")).forEach((e)=>{
			 e.style.border = "2px groove  rgba(60,50,150,0.3)"
			 })
		}


		document.addEventListener('keydown', function(event) {
			if (event.key === 'g' || event.key === 'G') {
				grid_view_toggle = !grid_view_toggle;
				if (grid_view_toggle) {
					showGridBorder()
				} else {
					hideGridBorder()
				}
			}
		});
		
		
		function mobileToggle(){
		grid_view_toggle = !grid_view_toggle;
				if (grid_view_toggle) {
					showGridBorder()
				} else {
					hideGridBorder()
				}
		}
	
	
	
	
	
	
		function unique(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
		  counter += 1;
		}
		return result;
	}

        let inventoryVisible = false;


		
		
		
		
        function toggleInventory() {
            const invCont = document.getElementById('inv-cont');
            const toggleHint = document.getElementById('toggle-hint');
            
            if (inventoryVisible) {
                invCont.style.display = 'none';
               // toggleHint.style.display = 'block'; // Show the hint text
            } else {
                invCont.style.display = 'block';
               // toggleHint.style.display = 'none'; // Hide the hint text
            }

            inventoryVisible = !inventoryVisible; // Toggle state
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'i' || event.key === 'I') {
                toggleInventory();
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault(); // Prevent the default save dialog
				alert("not currently functional, sorry")
				return;
                saveGrid();
            }
        });
		
		
		
		//important constants
		const puff_speed = 100;//0.1s (default)
		const max_puff_distance = 99;//99 (based on actual game)
		const global_collector_max_duration = 10;
		const global_vent_max_duration = 3000 //3 sec

        
        const items = [
            { name: "steam tubes" },
			{ name: "steam gear" },
            { name: "steam bellows" },
            { name: "steam riser bellows" },
            { name: "steam piston" },
            { name: "steam lifter piston" },
            { name: "steam collector" },            
            { name: "steam funnel up" },
            { name: "steam funnel down" },
            { name: "steam funnel left" },
            { name: "steam funnel right" },
			{ name: "steam crank" },
			{ name: "steam valve left" },
			{ name: "steam valve right" },
			{ name: "steam crossover URDL" },
			{ name: "steam crossover ULDR" },
			{ name: "steam scrambler" },      
			{ name: "steam organ" },			
            { name: "steam pipe",hide:null},
			{ name: "steam vent L" },     
			{ name: "steam vent R" },   	
            { name: "steam revolver" },
			{ name: "steam stomper" },
			{ name: "steam engine L" },     
			{ name: "steam engine R" },   			
            { name: "steam door" },
			{ name: "steam launcher" },
            { name: "steam spikes" },
            { name: "steam lamp" },
           
			{ name: "copper" }
        ];
		
		
		
		  const standard_behaviour = [ 
            "steam tubes",
            "steam bellows" ,
            "steam riser bellows",
            "steam piston",
            "steam lifter piston",		
            "steam gear",
			
			
			"steam valve left",
			"steam valve right",
			"steam crank",
			"steam collector",
			"steam crossover URDL",
			"steam crossover ULDR",
			"steam vent L",
			"steam vent R",
		    "steam organ",
			
			"steam door" 
        ];
		
		
		const activators = [    
            { name: "steam revolver" },
            { name: "steam stomper" },
			{ name: "steam engine L" },
			{ name: "steam engine R" },
			
			{ name: "steam door" }
        ];
		
		const single_powered = [    
            { name: "steam door" }
        ];


        let selectedItem = null;
        let gridData = Array.from({ length: 100 }, () => Array(100).fill(null)); // 2D array for grid

        const inv = document.getElementById('inv');
        const grid = document.getElementById('grid');
        const fileInput = document.getElementById('file-input');

        items.forEach(item => {
			if(item.hasOwnProperty("hide")){
				return; //equal to continue in forEach
				}
				
            const div = document.createElement('div');
            div.classList.add('inv-item');
            
            const img = document.createElement('img');
            img.src = "assets/" + item.name.toLowerCase().replaceAll(" ", "-") + ".png";
            img.alt = item.name;

            div.addEventListener('click', () => {
                selectedItem = { name: item.name, orientation: 0 };
            });

            div.appendChild(img);
            inv.appendChild(div);
        });

        


        //GENERATE MAIN 100 BY 100 GRID
        function GenerateMainGrid(){
			for (let i = 0; i < 10000; i++) {
				const cell = document.createElement('div');
				cell.id = `grid-cell-${i}`
				cell.classList.add('grid-cell');

				cell.addEventListener('click', () => placeBlock(cell, i));
				grid.appendChild(cell);
			}
		}
		
		
		
		//WHEN PAGE IS FULLY LOADED
		window.onload = function(){
			setTimeout(toggleInventory, 1000);
			setTimeout(toggleInventory, 1000);
			GenerateMainGrid()
		}
		
		
		
		
		
		
		//changing image of a block in grid at row,col
		function changeBlockImage(row, col, image) {
			const cell = document.getElementById(`grid-cell-${row * 100 + col}`);
			if (cell && cell.hasChildNodes()) {
				const img = cell.querySelector('img');
				if (img) {
					img.src = image;
				}
			}
		}


		//main function to handle placing blocks on the grid
        function placeBlock(cell, i) {
            const row = Math.floor(i / 100);
            const col = i % 100;

            if (cell.hasChildNodes()) {
                cell.innerHTML = '';
                cell.style.border = '1px solid rgba(60,50,120,0.5)';
                gridData[row][col] = "null";

                const existingButton = document.getElementById(`activator-${i}`);
                if (existingButton) {
                    document.body.removeChild(existingButton);
                }
            } else if (selectedItem) {
                const img = document.createElement('img');
                img.src = "assets/" + selectedItem.name.toLowerCase().replaceAll(" ", "-") + ".png";
                img.alt = selectedItem.name;
                cell.appendChild(img);
                cell.style.border = 'none';
				
				//handling how the object should be, depending on block
                gridData[row][col] = { 
                    name: selectedItem.name
                };
				
				//handle valve data
				if(selectedItem.name.includes("valve")){
					let _orientation = (selectedItem.name.includes("left"))?"L":"R";
					gridData[row][col] = new steam_valve(selectedItem.name,_orientation);
					console.log("valve placed-> "+gridData[row][col].orientation);
				}
				
				
             

				//block is an activator block, create activator button
                if (activators.some(a => a.name === selectedItem.name)&&!selectedItem.name.includes(" door")&&!selectedItem.name.includes(" crank")&&!selectedItem.name.includes(" vent")) {
                    let button = document.createElement("button");
                    button.id = `activator-${i}`;
                    button.classList.add("activators");
                    button.textContent = "▶️";
					
                    button.style.top = `${Math.floor(i / 100) * 40}px`;
                    button.style.left = `${(i % 100) * 40}px`;
                    button.addEventListener("click", () => {
                       console.log("activator button active")
                       steamSystem_main(Math.floor(i / 100), i % 100)
                    });

                    document.body.appendChild(button);
					button.style.opacity = "0.9"
                }
				
				//placing a steam crank
				if (selectedItem.name.includes("steam crank")) {
					let crank = new steam_crank(selectedItem.name);
					gridData[row][col] = crank;

					let button = document.createElement("button");
					button.id = `activator-${i}`;
					button.classList.add("activators");
					button.textContent = "️🔄";
					button.style.top = `${Math.floor(i / 100) * 40}px`;
					button.style.left = `${(i % 100) * 40}px`;

					button.addEventListener("click", () => {
						crank.toggleFlow();
						changeBlockImage(row, col, crank.getImage());
						console.log("steam crank rotated");
					});

					document.body.appendChild(button);
				}
				
				//placing a steam door
				if (selectedItem.name.includes("door")) {
					console.log('steam door placed');
					let door = new steam_door(selectedItem.name, "closed", row, col);
					gridData[row][col] = door; // Store the door in the grid

					let button = document.createElement("button");
					button.id = `activator-${i}`;
					button.classList.add("activators");
					button.textContent = "️🔘";
					button.style.top = `${Math.floor(i / 100) * 40}px`;
					button.style.left = `${(i % 100) * 40}px`;

					// Add event listener to toggle the state
					button.addEventListener("click", () => {
						let currentDoor = gridData[row][col]; // Get the existing door from the grid
						currentDoor.toggleState(); // Toggle the door's state
						changeBlockImage(row, col, currentDoor.getImage()); // Update the image
						console.log("steam door state changed: " + currentDoor.state);
					});

					document.body.appendChild(button);
				}
				
				if (selectedItem.name.includes("vent")) {
				    let vent_direction = (selectedItem.name.includes("L")?"L":"R");
					console.log("vent placed + "+ vent_direction);
					let vent = new steam_vent(selectedItem.name, "off",vent_direction);
					
					gridData[row][col] = vent; // Store the vent in the grid
				}

				
				
            }
        }

   

      

		//get data of blocks adjacent to input (row,col)
		function adj(row, col) {
			const adjacent = [];
			const rows = gridData.length;
			const cols = gridData[0].length;

			// Up
			let upBlock = row > 0 ? gridData[row - 1][col] || "null" : "null";
			if (upBlock !== "null" && upBlock.hasOwnProperty('name') && upBlock.name.includes("valve")) {
				adjacent.push(upBlock); // If vent is above, allow it
			} else {
				adjacent.push(upBlock); // Otherwise, behave as normal
			}

			// Down
			let downBlock = row < rows - 1 ? gridData[row + 1][col] || "null" : "null";
			if (downBlock !== "null" && downBlock.hasOwnProperty('name') && downBlock.name.includes("valve")) {
				adjacent.push(downBlock); // If vent is below, allow it
			} else {
				adjacent.push(downBlock); // Otherwise, behave as normal
			}

			// Left
			let leftBlock = col > 0 ? gridData[row][col - 1] || "null" : "null";
			if (leftBlock !== "null" && leftBlock.hasOwnProperty('name') && leftBlock.name.includes("valve")) {
				leftBlock = "null"; // If vent is on the left, treat it as null
			}
			adjacent.push(leftBlock);

			// Right
			let rightBlock = col < cols - 1 ? gridData[row][col + 1] || "null" : "null";
			if (rightBlock !== "null" && rightBlock.hasOwnProperty('name') && rightBlock.name.includes("valve")) {
				rightBlock = "null"; // If vent is on the right, treat it as null
			}
			adjacent.push(rightBlock);

			console.log(adjacent);
			return adjacent;
		}
		
		const arrow_mapper = {
			U:"∧",
			D:"∨",
			L:"<",
			R:">"
		}
		
		
		
		function getBlockData(row,col){
			let cell = document.getElementById(`grid-cell-${row * 100 + col}`)
			let in_grid = gridData[row][col]
			return in_grid;
		}	




		
		
		//unused template
		class general_steam_component {
			constructor(name){
				this.name = name;
			}
		}
		
		
		
		
		//steam vent class
		class steam_vent {
			constructor(name, state = "off", vent_direction) {
				this.name = name;
				this.state = state;
				this.vent_direction = vent_direction;
				this.timeout = null; // Keep track of the timeout
			}

			// Activate function to turn on the vent, wait, then turn it off
			activate(row, col) {
				// Always reset vent duration on activation
				console.log('vent activated, resetting duration');

				// Turn the vent "on"
				this.state = "on";
				changeBlockImage(row, col, "assets/steam-vent-" + this.vent_direction + "-on.png");

				// Clear any existing timeout to avoid multiple overlapping timeouts
				if (this.timeout) {
					clearTimeout(this.timeout);
					console.log('previous vent timeout cleared');
				}

				// Set a new timeout to turn off the vent after the specified duration
				this.timeout = setTimeout(() => {
					this.state = "off";
					changeBlockImage(row, col, "assets/steam-vent-" + this.vent_direction + ".png");
					console.log('vent off');
					this.timeout = null; // Reset the timeout variable
				}, global_vent_max_duration); // Use the global vent duration
			}
		}
		
		
		
		
		//steam collector class
		class Steam_Collector {
			constructor(name, steam_puff_count=0){
				this.name = 0
			}
		}

		
		
		
		
		
		//steam door class
		class steam_door {
			constructor(name, state, row, col) {
				this.name = name;
				this.state = state;
				this.row = row;
				this.col = col;
			}

			toggleState() {
				this.state = this.state === "closed" ? "open" : "closed";
			}

			getImage() {
				return this.state === "closed" ? "assets/steam-door.png" : "assets/steam-door-open.png";
			}
		}

		
		
		
		//steam crank class
		class steam_crank {
			constructor(name, flow = "vertical") {
				this.name = name;
				this.flow = flow;
			}

			toggleFlow() {
				if (this.flow === "vertical") {
					this.flow = "horizontal";
				} else {
					this.flow = "vertical";
				}
			}

			getImage() {
				return this.flow == "vertical" ? 'assets/steam-crank.png' : 'assets/steam-crank-horizontal.png';
			}
		}

		
		
		//steam valve class
		class steam_valve {
			constructor(name,orientation){
				this.name = name;
				this.orientation = orientation;
			}
			switch_orientation(){
				if(this.orientation == "L"){
					this.orientation = "R";
					console.log("new orientation:"+this.orientation)
				}
				else if(this.orientation == "R"){
					this.orientation = "L";
					console.log("new orientation:"+this.orientation)
				}
			}
		}




		//steam puff mechanics
		let Steam_Puffs = []
		const id_length = 5;
		
		
		class Puff {
			constructor(current_direction,position={row:null,col:null},distance_moved=0,collector_max_duration=global_collector_max_duration,unique_id,foundSpot = false,ele=null){
				this.current_direction = current_direction;
				this.position = position
				this.unique_id = unique(id_length);
				this.distance_moved = distance_moved;
				this.collector_max_duration = collector_max_duration;
				this.generate_puff(this.position.row,this.position.col)	
				this.foundSpot = foundSpot;
				this.ele = ele;
			}
			
			//generate a new steam puff visually
			generate_puff(row,col){
				 let cell = document.getElementById(`grid-cell-${ parseInt(this.position.row) * 100 + parseInt(this.position.col)}`);
			     if (cell) {
					// Create and display a new steam puff element
					const puffElement = document.createElement('div');
					puffElement.id = "puff-" + this.unique_id
					puffElement.innerHTML = this.current_direction
					puffElement.style.opacity = 0.7
					puffElement.classList.add('steam-puff');
					puffElement.style.top = '0px'; 
					puffElement.style.left = '0px'; 
					this.distance_moved+=1
					this.ele = puffElement;
					Steam_Puffs.push(this);
					cell.appendChild(puffElement)
					setTimeout(()=>{this.recursive_move()},puff_speed)
				 }
	 
		}
		
		
		
		//method to kill puff
		kill_puff(){	
		try{
				console.log(document.getElementById("puff-" + this.unique_id))
				document.getElementById("puff-" + this.unique_id).remove();
				Steam_Puffs.splice(Steam_Puffs.indexOf(Steam_Puffs.filter(a=>a.unique_id==this.unique_id)[0]),1);
				}
				catch(e){return}
				return;
		}
		
		//method to check if puff has found a spot to move to, if not kill the puff
		check_found_spot(){
			console.log('found spot:'+this.foundSpot)
			
			if(this.foundSpot == false){
					this.kill_puff();
					return;
				}
				
		}
		
		
		
		//recursive motion function
			recursive_move(){
			
						
				this.foundSpot = false; 
				
				console.log('moved/max:'+this.distance_moved+"/"+max_puff_distance)
				if(this.distance_moved==max_puff_distance){
					//kill steam puff
					this.kill_puff()
					console.log("puff kill was attempted- max distance")
					return;
				}
			
				let adjCells = adj(this.position.row,this.position.col);
				
				//adjacent cells validity checks
				let ValidArr = {
				  U: adjCells[0] !== null && adjCells[0] !== undefined && adjCells[0].hasOwnProperty('name') &&
					 (standard_behaviour.includes(adjCells[0].name) || adjCells[0].name.includes("funnel")), // up

				  D: adjCells[1] !== null && adjCells[1] !== undefined && adjCells[1].hasOwnProperty('name') &&
					 (standard_behaviour.includes(adjCells[1].name) || adjCells[1].name.includes("funnel")), // down

				  L: adjCells[2] !== null && adjCells[2] !== undefined && adjCells[2].hasOwnProperty('name') &&
					 (standard_behaviour.includes(adjCells[2].name) || adjCells[2].name.includes("funnel")), // left

				  R: adjCells[3] !== null && adjCells[3] !== undefined && adjCells[3].hasOwnProperty('name') &&
					 (standard_behaviour.includes(adjCells[3].name) || adjCells[3].name.includes("funnel"))  // right
				};
				
				
			
				
				
				//ULDR steam crossover handler
				if (gridData[this.position.row][this.position.col].name.includes("ULDR")) {
					console.log("Currently in ULDR crossover");

					// Check if adjacent cells are valid before changing direction
					if (this.current_direction == "U" && ValidArr["R"]) {
						this.changePosition("R", this.position.row, this.position.col+1);
					} else if (this.current_direction == "D" && ValidArr["L"]) {
						this.changePosition("L", this.position.row, this.position.col-1);
					} else if (this.current_direction == "L" && ValidArr["D"]) {
						this.changePosition("D", this.position.row+1, this.position.col);
					} else if (this.current_direction == "R" && ValidArr["U"]) {
						this.changePosition("U", this.position.row-1, this.position.col);
					} else {
						// If no valid move, kill the puff
						this.kill_puff();
					}

					this.check_found_spot();
					setTimeout(() => { this.recursive_move(); }, puff_speed);
					return;
				}
				
							
				// URDL steam crossover handler
				if (gridData[this.position.row][this.position.col].name.includes("URDL")) {
					console.log("Currently in URDL crossover");

					// Check if adjacent cells are valid before changing direction
					if (this.current_direction == "U" && ValidArr["L"]) {
						this.changePosition("L", this.position.row, this.position.col-1);
					} else if (this.current_direction == "D" && ValidArr["R"]) {
						this.changePosition("R", this.position.row, this.position.col+1);
					} else if (this.current_direction == "L" && ValidArr["U"]) {
						this.changePosition("U", this.position.row-1, this.position.col);
					} else if (this.current_direction == "R" && ValidArr["D"]) {
						this.changePosition("D", this.position.row+1, this.position.col);
					} else {
						// If no valid move, kill the puff
						this.kill_puff();
					}

					this.check_found_spot();
					setTimeout(() => { this.recursive_move(); }, puff_speed);
					return;
				}

				
				
				//currently in a steam door block
				if(gridData[this.position.row][this.position.col].name.includes("door")){
					gridData[this.position.row][this.position.col].toggleState();
					document.getElementById("puff-" + this.unique_id).style.opacity = "0"
					changeBlockImage(this.position.row,this.position.col,gridData[this.position.row][this.position.col].getImage());
					
					this.kill_puff();
					return;
				}
				
				
				
				//currently puff is in a funnel block, handle movement from funnel
				if(getBlockData(this.position.row,this.position.col).name.includes("funnel")){
					console.log('currently in funnel')
					
					if(getBlockData(this.position.row,this.position.col).name.includes("up")){
						if(ValidArr["U"]){
							console.log('up funnel')
							this.changePosition("U",this.position.row-1,this.position.col)
						}
					}
					else if(getBlockData(this.position.row,this.position.col).name.includes("down")){
						if(ValidArr["D"]){
							console.log('down funnel')
							this.changePosition("D",this.position.row+1,this.position.col)
						}
					}
					else if(getBlockData(this.position.row,this.position.col).name.includes("left")){
						if(ValidArr["L"]){
							console.log('left funnel')
							this.changePosition("L",this.position.row,this.position.col-1)
						}
					}
					else if(getBlockData(this.position.row,this.position.col).name.includes("right")){
						if(ValidArr["R"]){
							console.log('right funnel')
							this.changePosition("R",this.position.row,this.position.col+1)
						}
					}
					
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
						return;
				}
				
				
				
				
				
			


				
				//prevent back flow of steam, note applies for collectors, collectors go below this
				if(this.current_direction=="U"){
				 ValidArr.D = null
				}
				if(this.current_direction=="D"){
				 ValidArr.U = null
				}
				if(this.current_direction=="L"){
				 ValidArr.R = null
				}
				if(this.current_direction=="R"){
				 ValidArr.L = null
				}
				
				
					if(adjCells[2].hasOwnProperty("name")&&adjCells[2].name.includes("vent")){
				    	adjCells[2] = null
						ValidArr["L"] = null						
					}
					if(adjCells[3].hasOwnProperty("name")&&adjCells[3].name.includes("vent")){					
						adjCells[3] = null
						ValidArr["R"] = null
					}
					
				
				
				
				
				//currently puff is in a valve block, handle movement from valve
				if(gridData[this.position.row][this.position.col].name.includes("valve")){
					console.log("valve encountered")
					let valve = gridData[this.position.row][this.position.col]
					
					
					//check if exit direction of valve leads to a valid block
					//check if standard valve behaviour is possible
					if(ValidArr[valve.orientation]!="null"&&ValidArr[valve.orientation]!=null){
						//valve leads to valid block				
							console.log('valve attempt valid exit:'+valve.orientation);
							if(valve.orientation=="L"){
								this.changePosition("L",this.position.row,this.position.col)
								valve.switch_orientation();
								console.log("switched orientation:"+valve.orientation)
							}
							else if(valve.orientation=="R"){
								this.changePosition("R",this.position.row,this.position.col)
								valve.switch_orientation();
								console.log("switched orientation:"+valve.orientation)
							}							
					}
					
					//if standard behaviour is not possible, leads to invalid
					//go straight direction
					else{
						if(this.current_direction=="U"){
						if(ValidArr["U"]!="null"&&ValidArr["U"]!=null){
							this.changePosition("U",this.position.row,this.position.col);
							}
							}
							else if(this.current_direction=="D"){
						if(ValidArr["D"]!="null"&&ValidArr["D"]!=null){
							this.changePosition("D",this.position.row,this.position.col);
							}
							}
							else{
								this.kill_puff()
							}
						
							
						valve.switch_orientation();
						console.log("switched orientation:"+valve.orientation)
					}
					
					

					
					
					this.check_found_spot();
					
				}
				
				
				
					
				
				
				
				
				
				
				
				
				//steam crank system to prevent motion to improper crank
				//obtaining current block infront of steam puff
				let adj_block = adj(this.position.row,this.position.col)
				let block;
				if(this.current_direction=="U"){
					block = adj_block[0]
				}
				if(this.current_direction=="D"){
					block = adj_block[1]
				}
				if(this.current_direction=="L"){
					block = adj_block[2]
				}
				if(this.current_direction=="R"){
					block = adj_block[3]
				}
				
				//steam crank system to prevent motion to improper crank
				if(block.hasOwnProperty("name")){
				if(block.name.includes("crank")){
					if(this.current_direction=="U"&&block.flow=="horizontal"){
						alert("v")
						ValidArr.U = null
					}
					if(this.current_direction=="D"&&block.flow=="horizontal"){
						ValidArr.D = null
					}
					if(this.current_direction=="L"&&block.flow=="vertical"){
						ValidArr.L = null
					}
					if(this.current_direction=="R"&&block.flow=="vertical"){
						ValidArr.R = null
					}
					
					
				}
				}
				
				
				
				if(adj_block[1].hasOwnProperty("flow")){			
						if(this.current_direction=="L"&&adj_block[1].flow=="horizontal"){
							ValidArr["D"] = null
							adj_block[1] = null
						}
						if(this.current_direction=="R"&&adj_block[1].flow=="horizontal"){
							ValidArr["D"] = null
							adj_block[1] = null
						}
					}
				if(adjCells[0].hasOwnProperty("flow")){			
						if(this.current_direction=="L"&&adjCells[0].flow=="horizontal"){
							ValidArr["U"] = null
							adjCells[0] = null
						}
						if(this.current_direction=="R"&&adjCells[0].flow=="horizontal"){
							ValidArr["U"] = null
							adjCells[0] = null
						}
					}
					
					
				if(adj_block[2].hasOwnProperty("flow")){			
						if(this.current_direction=="D"&&adj_block[2].flow=="vertical"){
							ValidArr["L"] = null
							adj_block[2] = null
						}
						if(this.current_direction=="U"&&adj_block[2].flow=="vertical"){
							ValidArr["L"] = null
							adj_block[2] = null
							alert("j")
						}
					}
					
				if(adj_block[3].hasOwnProperty("flow")){			
						if(this.current_direction=="D"&&adj_block[3].flow=="vertical"){
							ValidArr["R"] = null
							adj_block[3] = null
						}
						if(this.current_direction=="U"&&adj_block[3].flow=="vertical"){
							ValidArr["L"] = null
							adj_block[3] = null
						}
					}
					
				
				
				
				//vent system (new)
				if (gridData[this.position.row][this.position.col].name.includes("vent")) {
				// Activate the vent
				gridData[this.position.row][this.position.col].activate(this.position.row, this.position.col);
					if(ValidArr[this.current_direction]==true){ 
					if(this.current_direction=="U")
						this.changePosition("U",this.position.row,this.position.col);
					if(this.current_direction=="D")
						this.changePosition("D",this.position.row,this.position.col);
					}
					else{
						this.kill_puff()
					}
				}
				
				
				
				
				if(ValidArr[this.current_direction]==true){ //can move straight
					console.log("straight line motion");
					if(this.current_direction=="U")
						this.changePosition("U",this.position.row-1,this.position.col);
					if(this.current_direction=="D")
						this.changePosition("D",this.position.row+1,this.position.col);
					if(this.current_direction=="L")
						this.changePosition("L",this.position.row,this.position.col-1);
					if(this.current_direction=="R")
						this.changePosition("R",this.position.row,this.position.col+1);
					
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				
				//right movement puff logic
				else if(this.current_direction=="U" && ValidArr["R"] ){
					this.changePosition("R",this.position.row,this.position.col+1);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="D" && ValidArr["L"] ){
					this.changePosition("L",this.position.row,this.position.col-1);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="L" && ValidArr["U"] ){
					this.changePosition("U",this.position.row-1,this.position.col);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="R" && ValidArr["D"] ){
					this.changePosition("D",this.position.row+1,this.position.col);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				
				//left movement puff logic
				else if(this.current_direction=="U" && ValidArr["L"] ){
					this.changePosition("L",this.position.row,this.position.col-1);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="D" && ValidArr["R"] ){
					this.changePosition("R",this.position.row,this.position.col+1);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="L" && ValidArr["D"] ){
					this.changePosition("D",this.position.row+1,this.position.col);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				else if(this.current_direction=="R" && ValidArr["U"] ){
					this.changePosition("U",this.position.row-1,this.position.col);
					this.check_found_spot();
					setTimeout(()=>{this.recursive_move()},puff_speed)
				}
				
				this.check_found_spot();
			}
			
			
			//change puff position in grid
				changePosition(newDirection, newRow, newCol) {
				// Get the current cell and new cell in the grid
				const currentCell = document.getElementById(`grid-cell-${this.position.row * 100 + this.position.col}`);
				const newCellIndex = newRow * 100 + newCol;
				const newCell = document.getElementById(`grid-cell-${newCellIndex}`);

				// Find the puff element in the current cell
				const puffElement = document.getElementById(`puff-${this.unique_id}`);
				if (puffElement) {
					// Remove puff element from the current cell
					if (currentCell) {
						currentCell.removeChild(puffElement);
					}

					// Append puff element to the new cell
					if (newCell) {
						puffElement.style.top = "0px"
						puffElement.style.left = "0px"
						this.current_direction = newDirection;
						puffElement.innerHTML = this.current_direction
						//increment distance moved
						this.distance_moved+=1;
						this.foundSpot = true;
						newCell.appendChild(puffElement);
					}

					// Update puff's position
					this.position = {row:newRow, col:newCol};
				}
			}

		}

		
			
			

       function steamSystem_main(act_r, act_c) {
			console.log(gridData);
			
			let adjCells = adj(act_r, act_c); // Get adjacent cells

			// Function to check if a cell is valid
			function isValidCell(cell) {
				return cell !== null && cell !== undefined && cell.hasOwnProperty('name');
			}

			// Function to check if propagation should occur
			function shouldPropagate(cell) {
				return standard_behaviour.includes(cell.name) || cell.name.includes("funnel");
			}

			// Function to handle puff propagation
			function handlePuff(direction, newRow, newCol) {
				let _puff = new Puff(direction, { row: newRow, col: newCol });
			}

			// Check and handle "sus crank" for a specific cell
			function checkSusCrank(row, col, directionIndex) {
				const cell = gridData[row][col];
				if (cell.name.includes("crank") && cell.flow === "horizontal") {
					console.log("Caught sus crank, treating as null");
					adjCells[directionIndex] = null; // Treat this cell as null
					return true; // Crank detected
				}
				return false; // No crank detected
			}

			// Main propagation logic
			function propagate() {
				if (isValidCell(adjCells[0]) && shouldPropagate(adjCells[0])) {
					// Check for sus crank and treat as null if found
					if (checkSusCrank(act_r - 1, act_c, 0)) {
						propagate(); // Retry after marking crank as null
						return;
					}
					// Move up
					handlePuff("U", act_r - 1, act_c);
				} 
				else if (isValidCell(adjCells[1]) && shouldPropagate(adjCells[1])) {
					// Check for sus crank and treat as null if found
					if (checkSusCrank(act_r + 1, act_c, 1)) {
						propagate(); // Retry after marking crank as null
						return;
					}
					// Move down
					handlePuff("D", act_r + 1, act_c);
				} 
				else {
					// No valid direction to propagate to
					console.log("No valid direction for puff propagation");
				}
			}

			// Initial propagation attempt
			propagate();
		}

	