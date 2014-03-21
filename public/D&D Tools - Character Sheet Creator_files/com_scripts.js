
// Object definition for a generic list object
// Basicly just an array some advanced functionality
function list(){

	// Main array of block elements
	this.elements = new Array();

	// Basic length property
	this.length = 0;
	
	// Methods for pushing ellements around the array
	this.insert = l_insertElement;
	this.append = l_appendElement;
	this.remove = l_removeElement;
	this.promote = l_promoteElement;
	this.demote = l_demoteElement;

}

	// List method which inserts an element into the array
	// Insertion is performed at the specified index, demoting following elements
	function l_insertElement(oElement,iIndex){
	
		// If the specified index is beyond the end of the array add it at the end
		if(iIndex >= this.elements.length){
			this.add(oElement);
			return;
		}
	
		// Make a gap in the element array at the specified index
		if(this.elements.length >= iIndex){
			for(var i = this.elements.length - 1; i  >= iIndex; i--){

				this.elements[i + 1] = this.elements[i];
			
			}
		}
		
		// Fill the gap with the provided insertion element
		this.elements[iIndex] = oElement;
		
		// Update the length property
		this.length = this.elements.length;
	
	}
	
	// List method which adds a new element to the array
	// Appends a new element to the end of the collection
	function l_appendElement(oElement){
		
		this.elements[this.elements.length] = oElement;

		// Update the length property
		this.length = this.elements.length;
	
	}
	
	// List method which removes an element from the array
	// Also compacts the array up to fill the slot that was vacated
	function l_removeElement(iIndex){
	
		// Delete the now-unused final element in the array
		this.elements.splice(iIndex,1);
	
		// Update the length property
		this.length = this.elements.length;

	}
	
	// Moves the element at the specified index up one spot in the array
	// Basicly just swaps it with the element immediately above it
	function l_promoteElement(iIndex){

		// Can't promote if it's already at the top of the list
		if(iIndex == 0) return;
	
		// Swap the specified element with the one above it
		var oLower = this.elements[iIndex];
		var oUpper = this.elements[iIndex - 1];
		this.elements[iIndex] = oUpper;
		this.elements[iIndex - 1] = oLower;
		
	}
	
	// Moves the element at the specified index down one spot in the array
	// Basicly just swaps it with the element immediately below it
	function l_demoteElement(iIndex){
	
		// Cant demote if it's already at the end of the list
		if(iIndex >= this.elements.length - 1) return;

		// Force the parameter value to an interger
		iIndex = parseInt(iIndex);

		// Swap the specified element with the one below it
		var oLower = this.elements[iIndex];
		var oUpper = this.elements[iIndex + 1];
		this.elements[iIndex] = oUpper;
		this.elements[iIndex + 1] = oLower;
		
	}

	
	
// Object definition for a page block object
// Pulls data extensively from the provided XML objects
function block(oXMLData,oXMLDefaultData,oXMLTemplate){

	// Load up the basic data from the data XML object
	this.type = oXMLData.getElementsByTagName('type')[0].childNodes[0].nodeValue;
	this.count = oXMLData.getElementsByTagName('count')[0].childNodes[0].nodeValue;
	this.hidden = oXMLData.getElementsByTagName('hidden')[0].childNodes[0].nodeValue;
	
	// Grab the default field values from the default XML object
	var oDefaults = oXMLDefaultData.getElementsByTagName('element')[0].getElementsByTagName('value');
	this.defaultValues = new Array();
	for(var i = 0; i < oDefaults.length; i++){
		if(oDefaults[i].childNodes.length) this.defaultValues[i] = oDefaults[i].childNodes[0].nodeValue;
		else this.defaultValues[i] = '';
	}
	
	// Mill the values out of the vallue list for easier access
	this.elements = new list();
	var oElements = oXMLData.getElementsByTagName('element');
	var oValues = new Array();
	var aValues = new Array();
	for(var i = 0; i < oElements.length; i++){
		oValues = oElements[i].getElementsByTagName('value');
		aValues = new Array();
		for(var n = 0; n < oValues.length; n++){
			if(oValues[n].childNodes.length) aValues[n] = oValues[n].childNodes[0].nodeValue;
			else aValues[n] = '';
		}
		this.elements.append(aValues);
	}

	// Fetch the proper template data from the template object
	var oTemplate = getXMLElementByName(oXMLTemplate,'template',this.type);

	if(oTemplate.getElementsByTagName('pred')[0].childNodes.length){
		this.displayHeader = oTemplate.getElementsByTagName('pred')[0].childNodes[0].nodeValue;
	}
	else this.displayHeader = '';
	
	if(oTemplate.getElementsByTagName('postd')[0].childNodes.length){
		this.displayFooter = oTemplate.getElementsByTagName('postd')[0].childNodes[0].nodeValue;
	}
	else this.displayFooter = '';
	
	if(oTemplate.getElementsByTagName('pref')[0].childNodes.length){
		this.formHeader = oTemplate.getElementsByTagName('pref')[0].childNodes[0].nodeValue;
	}
	else this.formHeader = '';
	
	if(oTemplate.getElementsByTagName('postf')[0].childNodes.length){
		this.formFooter = oTemplate.getElementsByTagName('postf')[0].childNodes[0].nodeValue;
	}
	else this.formFooter = '';
	
	this.elementType = oTemplate.getElementsByTagName('element')[0].childNodes[0].nodeValue;
	this.minCount = oTemplate.getElementsByTagName('minCount')[0].childNodes[0].nodeValue;
	this.maxCount = oTemplate.getElementsByTagName('maxCount')[0].childNodes[0].nodeValue;
	this.fixed = oTemplate.getElementsByTagName('fixed')[0].childNodes[0].nodeValue;

	// Prefetch the element templates from the template data
	var oElement = getXMLElementByName(oXMLTemplate,'element',this.elementType);
	this.displayTemplate = oElement.getElementsByTagName('display')[0].childNodes[0].nodeValue;
	this.formTemplate = oElement.getElementsByTagName('form')[0].childNodes[0].nodeValue;

	if(oElement.getElementsByTagName('display').length > 1){
		this.altTemplate = oElement.getElementsByTagName('display')[1].childNodes[0].nodeValue;
	}
	else this.altTemplate = '';

	
	// Methods for manipulating the element list
	this.insertElement = bl_insertElement;
	this.appendElement = bl_appendElement;
	this.removeElement = bl_removeElement;
	this.promoteElement = bl_promoteElement;
	this.demoteElement = bl_demoteElement;
	
	// Method for setting the values in an element
	this.setValue = bl_setValue;
	
	// Code production methods for the form and display code
	this.generateDisplayCode = bl_generateDisplayCode;
	this.generateFormCode = bl_generateFormCode;
	this.generateDataCode = bl_generateDataCode;
	
	// Code storage parameters to avoid unnecesary generation
	this.displayCode = this.generateDisplayCode();
	this.formCode = this.generateFormCode();
	this.dataCode = this.generateDataCode();
	
}

	// Methos of the Block object type which sets an element value
	// Routs the value and triggers the display code update
	function bl_setValue(iElement,iField,sValue){
		
		this.elements.elements[iElement][iField] = sValue;
		this.displayCode = this.generateDisplayCode();
		this.dataCode = this.generateDataCode();
	
	}

	// Code production method of the Block object type
	// Collects the HTML header, footer, and element display code
	function bl_generateDisplayCode(){
	
		// Return nothing immediately if this element is hidden
		if(this.hidden == '1') return '';
	
		// Start right off with the display header code
		var sCode = this.displayHeader;
		
		// Go through the elements and add thier code to the pile
		var sTemplate;
		for(var i = 0; i < this.elements.length; i++){
			if(!(i % 2) && this.altTemplate) sTemplate = this.altTemplate;
			else sTemplate = this.displayTemplate;
			sCode += restoreBrackets(replaceTokens(sTemplate,this.elements.elements[i]));
		}
		
		// Add teh display footer code onto the end
		sCode += this.displayFooter;
		
		// And return...
		return sCode;
	
	}

	// Code production method of the Block object type
	// Collects the data from elements and creates an XML data block
	function bl_generateDataCode(){
	
		// Start right off with the data block header code
		var sCode = '	<block name="' + this.type + '">\n';
		sCode += '		<type>' + this.type + '</type>\n';
		sCode += '		<count>' + this.elements.length + '</count>\n';
		sCode += '		<hidden>' + this.hidden + '</hidden>\n';
		sCode += '		<elements>\n';
		
		// Go through the elements and add thier data to the pile
		for(var i = 0; i < this.elements.length; i++){
			sCode += '			<element>\n';
			for(var n = 0; n < this.elements.elements[i].length; n++){
				sCode += '				<value>' + escapeBrackets(this.elements.elements[i][n]) + '</value>\n';
			}
			sCode += '			</element>\n';
		}
		
		// Close the lement list and data block
		sCode += '		</elements>\n';
		sCode += '	</block>\n';
		
		// And return...
		return sCode;
	
	}
	
	// Code production method of the Block object type
	// Collects the HTML header, footer, and element form code
	function bl_generateFormCode(){
	
		// Start right off with the display header code
		var sCode = this.formHeader;
		
		// Go through the elements and add thier code to the pile
		for(var i = 0; i < this.elements.length; i++){
			sCode += replaceTokens(this.formTemplate,this.elements.elements[i]).replace(/\$E/g,i);
		}
		
		// Add teh display footer code onto the end
		sCode += this.formFooter;
		
		// And return...
		return sCode;
	
	}

	// Element list manipulation method for the Block object
	// Wrapper for the basic equivelent list manipulation method
	function bl_insertElement(iIndex){
	
		this.elements.insert(this.defaultValues,iIndex);
		this.displayCode = this.generateDisplayCode();
		this.formCode = this.generateFormCode();
		this.dataCode = this.generateDataCode();
		
	}
	
	// Element list manipulation method for the Block object
	// Wrapper for the basic equivelent list manipulation method
	function bl_appendElement(){
	
		// If we're already add the maximum number of elements then abort
		if(this.elements.length >= this.maxCount) return;
	
		var aDefaults = this.defaultValues.slice(0);
		this.elements.append(aDefaults);
		this.displayCode = this.generateDisplayCode();
		this.formCode = this.generateFormCode();
		this.dataCode = this.generateDataCode();
		
	}

	// Element list manipulation method for the Block object
	// Wrapper for the basic equivelent list manipulation method
	function bl_removeElement(iIndex){
	
		// If we're down to the minimum number of elements then abort
		if(this.elements.length <= this.minCount) return;
	
		this.elements.remove(iIndex);
		this.displayCode = this.generateDisplayCode();
		this.formCode = this.generateFormCode();
		this.dataCode = this.generateDataCode();
		
	}
	
	// Element list manipulation method for the Block object
	// Wrapper for the basic equivelent list manipulation method
	function bl_promoteElement(iIndex){
	
		this.elements.promote(iIndex);
		this.displayCode = this.generateDisplayCode();
		this.formCode = this.generateFormCode();
		this.dataCode = this.generateDataCode();
	
	}
	
	// Element list manipulation method for the Block object
	// Wrapper for the basic equivelent list manipulation method
	function bl_demoteElement(iIndex){
	
		this.elements.demote(iIndex);
		this.displayCode = this.generateDisplayCode();
		this.formCode = this.generateFormCode();
		this.dataCode = this.generateDataCode();
	
	}	
	
	
	
// General use replacement function for element and form templates
// Replaces tokens in the form of $n with the coresponding array value
function replaceTokens(sString,aReplacements){

	// Perform the replacement for each value in the value array
	var rPattern;
	for(var i = 0; i < aReplacements.length; i++){
	
		// Pattern to match is dolar sign followed by array index
		// Excluding matches followed by a diget to sperate $1 from $10 and similar
		rPattern = new RegExp('\\$' + i + '([^\\d]+)','g');
		sString = sString.replace(rPattern,aReplacements[i] + '$1');
	
	}
	
	return sString;

}
	
//  Fetches a chunk of an XML document based on it's name attribute
// Searches within a specific tag name array and returns the first
function getXMLElementByName(oXML,sTagName,sName){

	var oElements = oXML.getElementsByTagName(sTagName);
	for(var i = 0; i < oElements.length; i++){
		if(oElements[i].getAttribute('name') == sName) return oElements[i];
	}
	return false;
	
}
	
// Fetches the contense of a server side file as a string
// Can be used to fetch pretty much anything, but mostly XML files
function loadFile(sFilePath){

	// Abbort if no file name was passed
	if(sFilePath == '' || sFilePath == self.location) return;

	// Create a new Active X Object to do the fetch
	var xFile;
	switch(typeof ActiveXObject){
	
		// Create the Active X Object for Internet Explorer
		case 'function':
			xFile = new ActiveXObject('Microsoft.XMLHTTP');
			break;
	
		// Create the Active X Object for other browers
		default:
			xFile = new XMLHttpRequest;
			xFile.overrideMimeType("text/xml");

	}

	// Fetch the requested file
	try{
	
		var sName = sFilePath + "?version=" + fVersion;
		xFile.open('GET',sName,false);
		xFile.send('');

	}catch(e){

		// Return empty array on error
		return;
		
	}
	
	// Return the file contents
	return xFile.responseText;

}
	
// Fetches and parses the contents of a server side file as XML
// Basicly a wrapper on loadFile and parseXML functions
function loadXMLFile(sFilePath){

	// Get the contents of the file as a string
	sContent = loadFile(sFilePath);
	return parseXML(sContent);

}

// Parses the contents of a string as XML data
// May do unexpected things if the string isn't properly formatted
function parseXML(sString){

	// Parse code for Internet Explorer
	try{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(sString);
	}
	// Parse code for all other browers
	catch(e){
		try{
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(sString,"text/xml");
		}
		catch(e){
			alert(e.message);
			return;
		}
	}
	
	return xmlDoc;
	
}

// General utility function which sets a select box selection
// Selection is by value which makes things more complicated
function setSelection(oSelect,sValue){

	var aOptions = oSelect.options;
	for(var i = 0; i < aOptions.length; i++){
		if(aOptions[i].value == sValue){
			oSelect.selectedIndex = i;
			return;
		}
	}
	
}

// Converts HTML break tags in a string with the new line character
// Used to convert back formatted data into the form's textarea
function convertBreaks(sText){

	if(sText) return sText.replace(/<br>/g,'\n');
	else return '';

}

// Replaces line breaks in a multiline text with <br>
// Copies the source element and returns it transparently
function lineBreaker(oSource){

	var oTemp = oSource.cloneNode(true);
	oTemp.value = oSource.value.replace(/\r\n/g,'<br>');
	oTemp.value = oTemp.value.replace(/\n/g,'<br>');
	return oTemp;

}

// Replaces left angle brackets with the appropriate token code
// Used to escape code in user data for XML storage
function escapeBrackets(sString){

	if(sString) sString = sString.replace(/&/g,'&amp;');
	if(sString) return sString.replace(/</g,'&lt;');
	else return '';

}

// Replaces left angle brackets token with the actual character
// Used to un-escape code in user data for XML storage
function restoreBrackets(sString){

	if(sString) sString = sString.replace(/&amp;/g,'&');
	if(sString) return sString.replace(/&lt;/g,'<');
	else return '';

}

// Text cleaning general utility function
// Strips any completely blank lines from a string
function trimBlankLines(sString){

	sString = sString.replace(/\n[\s]*\n/g,'\n');
	sString = sString.replace(/^[\s]*\n/,'');
	sString = sString.replace(/\n[\s]*$/,'');
	return sString;

}

function toggleCodeRow(oLink){
	
	if(oLink.innerHTML == "HIDE CODE"){
		oLink.innerHTML = "SHOW CODE";
		document.getElementById("code_row").style.height = "0px";
		document.getElementById("anchor").style.display = "none";
	}
	else{
		oLink.innerHTML = "HIDE CODE";
		document.getElementById("code_row").style.height = "134px";
		document.getElementById("anchor").style.display = "block";
	}

}
