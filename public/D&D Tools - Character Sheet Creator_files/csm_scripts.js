
// Function that runs on page startup and does all the initialization
// Pretty much just a giant global variable declaration followed by an inital redraw
function startUp(bImportData){

	// Store the default active tab
	iActiveTab = 1;
	
	// Initialize a variable for the defered update timer
	tDeferedUpdateTimer = '';
	
	// Fetch the DOM refferences for the three blocks from the page
	oForm = document.getElementById('form');
	oDisplay = document.getElementById('display');
	oCode = document.getElementById('code');
	oDataBlock = document.getElementById('data');
	
	// Set the data version number
	// Update to force re-caching of the XML files
	fVersion = 1.09;
	
	// Load the sheet template and default data
	oTemplate = loadXMLFile('csm_templates.xml');
	oDefault = loadXMLFile('csm_default.xml');
	
	// Use imported data or default as specified
	if(bImportData) oData = parseXML(document.getElementById('data').value);
	else oData = loadXMLFile('csm_default.xml');
	
	// Initialize the master list of character sheet elements
	lSheet = new list();
	
	// Populate the sheet elements list with the default data
	var oBlocks = oData.getElementsByTagName('block');
	var oDefaultData;
	var blBlock;
	for(var i = 0; i < oBlocks.length; i++){
		
		oDefaultData = getXMLElementByName(oDefault,'block',oBlocks[i].getAttribute('name'));
		blBlock = new block(oBlocks[i],oDefaultData,oTemplate);
		lSheet.append(blBlock);

	}
	
	// Construct the display and form code and populate the page
	updatePage(false);

	// Set the visible tab
	showTab(iActiveTab);
	
}

// Updates the page using the global template and data objects
// Used to refresh with changes after each update to the page contents
function updatePage(bSkipForm){

	// Initialize the code with the tool's prepend code	
	var sData = '<data>\n';
	if(oTemplate.getElementsByTagName('tpred')[0].childNodes.length){
		var sDisplay = oTemplate.getElementsByTagName('tpred')[0].childNodes[0].nodeValue;
	}
	else sDisplay = '';
	
	if(oTemplate.getElementsByTagName('tpref')[0].childNodes.length){
		var sForm = oTemplate.getElementsByTagName('tpref')[0].childNodes[0].nodeValue;
	}
	else sForm = '';
	
	// Go through the master page list and get the latest code

	var sVis = '';
	for(var i = 0; i < lSheet.length; i++){
	
		sDisplay += lSheet.elements[i].displayCode;
		sData += lSheet.elements[i].dataCode;
		
		// Get the visibility word for each block
		if(lSheet.elements[i].hidden == 1) sVis = 'Show';
		else sVis = 'Hide';
		
		sForm += lSheet.elements[i].formCode.replace(/\$B/g,i).replace(/\$V/g,sVis);
		
	}
	
	// Append the tool's append code
	sData += '</data>';
	if(oTemplate.getElementsByTagName('tpostd')[0].childNodes.length){
		sDisplay += oTemplate.getElementsByTagName('tpostd')[0].childNodes[0].nodeValue;
	}
	
	if(oTemplate.getElementsByTagName('tpostf')[0].childNodes.length){
		sForm += oTemplate.getElementsByTagName('tpostf')[0].childNodes[0].nodeValue;
	}
	
	// Cull out any entirely blank lines that got in
	sDisplay = trimBlankLines(sDisplay);
	
	// Refresh the display and code blocks
	oDisplay.innerHTML = sDisplay;
	oCode.value = "notextile. " + sDisplay;
	oDataBlock.value = sData;

	// Refresh and repopulate the form only if needed
	if(!bSkipForm){

		// Set the visibility of the form tabs
		sForm = replaceVisMarkers(sForm);
		
		// Reset the form with the newly generated code
		oForm.innerHTML = sForm;
		
		var oBlock;
		var oElement;
		var oField;
		// Loop through all the blocks in the sheet list
		for(var n = 0; n < lSheet.length; n++){
		
			// Loop through all the elements in each block
			oBlock = lSheet.elements[n];
			for(var o = 0; o < oBlock.elements.length; o++){
			
				// Loop through all the values for each element
				oElement = oBlock.elements.elements[o];
				for(var p = 0; p < oElement.length; p++){
			
					// Grab a handle to the form field
					oField = document.getElementsByName(n + '_' + o + '_' + p)[0];
					if(oField){
						if(oField.type == 'select') setSelection(oField,oElement[p]);
						else if(oField.tagName == 'TEXTAREA') oField.value = restoreBrackets(convertBreaks(oElement[p]));
						else oField.value = restoreBrackets(oElement[p]);
					}
					
				}
			}
		}

	}
	
}

// Replaces the form visibility markers in the form code
// Makes sure the right tab is visible and others are hidden
function replaceVisMarkers(sString){

	if(iActiveTab == 1){
		var sTabOne = 'display:block;';
		var sTabTwo = 'display:none;';
		var sTabThree= 'display:none;';
	}
	else if(iActiveTab == 2){
		var sTabOne = 'display:none;';
		var sTabTwo = 'display:block;';
		var sTabThree= 'display:none;';
	}
	else{
		var sTabOne = 'display:none;';
		var sTabTwo = 'display:none;';
		var sTabThree= 'display:block;';
	}
	
	sString = sString.replace(/\$t1/,sTabOne);
	sString = sString.replace(/\$t2/,sTabTwo);
	sString = sString.replace(/\$t3/,sTabThree);
	return sString;

}

// Page specific function wich strips out the field info and updates values
// Called whenever a field gets updated, this is actualy pretty generic
function updateField(oField){

	// Push the new value to the element array
	var aKeys = oField.name.split('_');
	lSheet.elements[aKeys[0]].setValue(aKeys[1],aKeys[2],oField.value);
	
	// Refresh the page with new code based on the updated field's new data
	// Continualy defered until the user stops typing for at least half a second
	clearTimeout(tDeferedUpdateTimer);	
	tDeferedUpdateTimer = setTimeout('updatePage(true);',750);
	
}		

// Page specific function for the add element button in the form
// Adds a new default element to the end of the block
function addElement(oSource){

	// Simply add a new element to the block
	var aKeys = oSource.name.split('_');
	lSheet.elements[aKeys[0]].appendElement();
	
	// Refresh the form, display, and code areas
	updatePage(false);

}

// Page specific function for the delete button on each element
// Figures out which element called it and then deletes it from the block
function deleteElement(oSource){

	// Get the index of the element
	var aKeys = oSource.name.split('_');
	
	// Kill the required element
	lSheet.elements[aKeys[0]].removeElement(aKeys[1]);
	
	// Refresh the form, display, and code areas
	updatePage(false);

}

// Page specific function for the promote button on each block
// Figures out which element called it and then promotes it
function promoteBlock(oSource){

	// Get the index of the block
	var iIndex = oSource.name.split('_')[0];
	
	// Abort the promotion if the next element up is fixed
	if(lSheet.elements[iIndex - 1].fixed == 1) return;
	
	// Promote the specified element
	lSheet.promote(iIndex);
	
	// Refresh the form, display, and code areas
	updatePage(false);

}

// Page specific function for the demote button on each block
// Figures out which element called it and then demotes it
function demoteBlock(oSource){

	// Get the index of the element
	var iIndex = oSource.name.split('_')[0];
	
	// Demote the required element
	lSheet.demote(iIndex);
	
	// Refresh the form, display, and code areas
	updatePage(false);	
	
}

// Shows the specified tab and hides the other two
// Used to keep the form compact by spliting it over tabs by column
function showTab(iTabNumber){

	// Lots of hard coded CSS here, but it's way easier this way
	var sDisplay = '';
	var sBorder = '';
	var sBackground = '';
	var sHeight = '';
	
	// Loop through the three tabs
	var oTab;
	for(var i = 1; i <= 3; i++){

		// Set the style to activate the active tab when found
		if(i == iTabNumber){
			sDisplay = 'inline';
			sBorder = 'none';
			sBackground = '#BBBBBB';
			sHeight = '18px';
		}
		
		// Set the style to deactivate any other tab that's found
		else{
			sDisplay = 'none';
			sBorder = 'solid';
			sBackground = '#999999';
			sHeight = '17px';
		}
		
		// Apply the appropriate style to each tab as it's found
		oHolder = document.getElementById('holder_' + i);
		oTab = document.getElementById('tab_' + i);
		if(oHolder && oTab){
			oHolder.style.display = sDisplay;
			oTab.style.borderBottomStyle = sBorder;
			oTab.style.backgroundColor = sBackground;
			oTab.style.height = sHeight;
		}
		
	}
	
	// Set the proper value in the global variable
	iActiveTab = iTabNumber;

}

// Toggles the visibility state of the calling block
// Cuases regeneration of the block code and full update
function toggleBlockVis(oSource){

	// Get the index of the element
	var iIndex = oSource.name.split('_')[0];
	
	// Grab a handle to the block
	var oBlock = lSheet.elements[iIndex];
	
	// Toggle the parameter on the object
	if(oBlock.hidden == '1') oBlock.hidden = '0';
	else oBlock.hidden = '1';
	
	// Re-generate the code for the block
	oBlock.displayCode = oBlock.generateDisplayCode();
	oBlock.formCode = oBlock.generateFormCode();
	oBlock.dataCode = oBlock.generateDataCode();
	
	// Refresh the form, display, and code areas
	updatePage(false);	
	
}