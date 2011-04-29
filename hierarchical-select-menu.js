<script language="Javascript">
// Hierarchical Select Menu script by Flooble.com.
// --------------------------------------------------------------------------------------
// Copyright (c) 2004 Animus Pactum Consulting Inc.
// This script is provided as is, without any warranties whatsoever.
// You may modify and re-distribute this script as long as you do not remove this notice.
// Go to http://www.flooble.com/scripts/hier.php for more information.
// --------------------------------------------------------------------------------------
	var currentSelections = new Array();
	var currentMenu = 0;
	var optionsCount = 0;
	var selectOptions = new Array();
	var selectMenuOpen = false;
	var selectMenus = new Array();
	var selectOpenSubmenus = new Array();
	var selectSubmenuCount = 0;
	var selectOverMenu = false;

    var ie = false;
	if (document.all) { ie = true; }

	function getObj(id) {
		if (ie) { return document.all[id]; } 
		else {	return document.getElementById(id);	}
	}

	var selectDownArrow = '▼';
	var selectRightArrow = '►';
	if (ie) { selectRightArrow = '>'; }

	function selectGetOptions(level) {
		var option;
		var returnArray = new Array();
		for (i = 0; i < selectOptions.length; i++) {
			option = selectOptions[i];
			if (option.substring(0, level.length + 2) == '' + level + '||') {
				returnArray[returnArray.length] = selectGetOptionLink(option, i);
			} 
		}
		return returnArray;
	}
	
	function selectGetOptionLink(option, index) {
		var start = option.indexOf('||');
		var finish = option.lastIndexOf('||');
		var level = option.substring(0, start);
		var prefix = option.substring(start+2, finish);
		var suffix = option.substring(finish+2, option.length);
		if (suffix.indexOf('@@') == 0) {
			var parentIndex = level.substring(level.lastIndexOf('.') + 1, level.length);
			if (option.indexOf('' + parentIndex) != 0) parentIndex++;
			return '<div class="select_inner_div" onmouseover="selectHighlight(this); selectOpenTimer(' + (index+1) + ', \'' + suffix + '\', this, ' + parentIndex + ');" onmouseout="selectLowlight(this);selectCancelOpenTimer();" onClick="selectOpenSubmenu(' + (index+1) + ', \'' + suffix + '\', this, ' + parentIndex + ');"><span style="float:left;">' + prefix + '</span> ' + selectRightArrow + '</div>';
		} else { 
			return '<div class="select_inner_div" onmouseover="selectHighlight(this);" onmouseout="selectLowlight(this);" onClick="selectPickValue(' + index + ', \'' + suffix + '\');"><span style="float:left;">' + prefix + '</span> </div>';
		}
	}

	var selectTimerParent;
	var selectSubmenuTimer;
	function selectOpenTimer(index, suffix, parent, parentIndex) {
		selectTimerParent = parent;
		var command = 'selectOpenSubmenu(' + index + ', \'' + suffix + '\', selectTimerParent, ' + parentIndex + ')';
		selectSubmenuTimer = setTimeout(command, 1000);
	}
	
	function selectCancelOpenTimer() {
		clearTimeout(selectSubmenuTimer);
	}
	
	var selectHighlightedObject = false;
	
	function selectHighlight(div, index) {
		if (selectHighlightedObject) {
			selectLowlight(selectHighlightedObject);
		}
		div.className = 'select_inner_active';
		selectHighlightedObject = div;
	}

	function selectLowlight(div) {
		div.className = 'select_inner_div';
		selectHighlightedObject = false;
	}

	function selectGetOptionName(index) {
		var option = selectOptions[index];
		return option.substring(option.indexOf('||')+2, option.lastIndexOf('||'));
	}
	
	function selectGetOptionGroup(index) {
		var option = selectOptions[index];
		return option.substring(0, option.indexOf('||'));
	}
	
	function openSelect(parent) {
		var openMenu = true;
		if (selectMenuOpen != false) {
			openMenu = (selectMenuOpen != parent.id);
			var index = currentSelections[selectMenuOpen];
			var option = selectOptions[index];
			selectPickValue(index, option.substring(option.lastIndexOf('||') + 2, option.length));
		} 

		if (openMenu) {
			selectMenuOpen = parent.id;
			var div = selectGetSubMenu(selectMenus[parent.id]);
			selectPositionMenu(div, parent);
			div.style.display = 'block';
			if (div.scrollWidth < 100) { div.style.width = 100; }
			selectOpenSubmenus[selectSubmenuCount] = selectMenus[parent.id];
			selectSubmenuCount++;
		}
	}
	
	function selectRelateMenu(menuName) {
		var field = getObj(menuName + '_field')
		var value = field.value;
		var startIndex = '' + selectMenus[menuName];
		var label;
		var option;
		var index = startIndex;
		if (value != '') {
			for (i = 0; i < selectOptions.length; i++) {
				option = selectOptions[i];
				if (option.substring(0, startIndex.length) == startIndex) {
					if (option.substring(option.lastIndexOf('||')+2, option.length) == value) {
						index = i;
					}
				}
			}
		}

		currentSelections[menuName] = index;
		label = selectGetOptionName(index);
		getObj(menuName).innerHTML = label + ' ' + selectDownArrow;
	}
	
	function selectOpenSubmenu(index, suffix, parent, parentIndex) {
		for (i = selectSubmenuCount; selectOpenSubmenus[i-1] != parentIndex; i--) {
			idx = selectOpenSubmenus[i-1];
			div = getObj('select_div_' + idx);
			div.style.display = 'none';
			selectSubmenuCount--;
		}

		var div = selectGetSubMenu(index);
		div.style.visibility = 'hidden';
		div.style.display = 'block';
		if (div.scrollWidth < 100) { div.style.width = 100; }
		selectPositionMenu(div, parent);
		div.style.visibility = 'visible';
				
		selectOpenSubmenus[selectSubmenuCount] = index;
		selectSubmenuCount++;
	}
	
	function selectPositionMenu(menu, parent) {
		menu.style.top = 1;
		menu.style.left = 1;
		if (parent.id == selectMenuOpen) {
			menu.style.left = selectGetAbsoluteOffsetLeft(parent);
			menu.style.top = selectGetAbsoluteOffsetTop(parent) + parent.scrollHeight + 1;
		} else {
			if (selectGetAbsoluteOffsetLeft(parent) + parent.scrollWidth + 4 + menu.scrollWidth > document.body.offsetWidth) {
				menu.style.left = selectGetAbsoluteOffsetLeft(parent) - menu.scrollWidth - 4;
			} else {
				menu.style.left = selectGetAbsoluteOffsetLeft(parent) + parent.scrollWidth + 4;
			}
			menu.style.top = selectGetAbsoluteOffsetTop(parent);
		}		
	}
	
	function selectPickValue(index, value) {
		var idx, div;
		for (i = selectSubmenuCount; i > 0; i--) {
			idx = selectOpenSubmenus[i-1];
			div = getObj('select_div_' + idx);
			div.style.display = 'none';
		}
		selectSybmenuCount = 0;
		currentSelections[selectMenuOpen] = index;
		getObj(selectMenuOpen).innerHTML = selectGetOptionName(index) +  ' ' + selectDownArrow;
		getObj(selectMenuOpen + '_field').value = value;
		selectMenuOpen = false;
	}
	
	function selectGetSubMenu(index) {
		var div = getObj('select_div_' + index);
		if (div == null) {
			div = selectBuildDivFor(index);
		}
		return div;
	}
	
	function selectBuildDivFor(index) {
		if (!document.createElement) { return; }
        var elemDiv = document.createElement('div');
        if (typeof(elemDiv.innerHTML) != 'string') { return; }
		elemDiv.id = 'select_div_' + index;
		elemDiv.className = 'select_pulldown';
		elemDiv.style.position = 'absolute';
		elemDiv.style.display = 'none';

		if (ie) {
			elemDiv.attachEvent('onmouseover', selectMouseOver);
			elemDiv.attachEvent('onmouseout', selectMouseOut);
		} else {		
			elemDiv.addEventListener('mouseover', selectMouseOver, false);
			elemDiv.addEventListener('mouseout', selectMouseOut, false);
		}
		
		var options = selectGetOptions(selectGetOptionGroup(index));
		for (i = 0; i < options.length; i++) {
			elemDiv.innerHTML = elemDiv.innerHTML + options[i];
		}
        document.body.appendChild(elemDiv);
        return elemDiv;		
	}
	
	function selectMouseOver() {
		selectOverMenu = true;
	}
	
	function selectMouseOut() {
		selectOverMenu = false;
	}
	
     function selectGetAbsoluteOffsetTop(obj) {
     	var top = obj.offsetTop;
     	var parent = obj.offsetParent;
     	while (parent != document.body) {
     		top += parent.offsetTop;
     		parent = parent.offsetParent;
     	}
     	return top;
     }
     
     function selectGetAbsoluteOffsetLeft(obj) {
     	var left = obj.offsetLeft;
     	var parent = obj.offsetParent;
     	while (parent != document.body) {
     		left += parent.offsetLeft;
     		parent = parent.offsetParent;
     	}
     	return left;
     }

	if (ie) {
		document.attachEvent('onclick', selectCheckClick);
	} else {
		document.addEventListener('click', selectCheckClick, false);
	}
	
	function selectCheckClick() {
		if (selectMenuOpen && !selectOverMenu) {
			var index = currentSelections[selectMenuOpen];
			var option = selectOptions[index];
			selectPickValue(index, option.substring(option.lastIndexOf('||') + 2, option.length));
		}
		return true;
	}
	
</script>

<style>
.select_pulldown { 
	padding:2px; 
	border: 1px solid #000000; 
	background: #EEEEEE; 
	color: #000000; 
	font-family: Verdana;
	font-size: 12px;
}

A.select_pulldown { text-decoration:none; }

A.select_inner { text-decoration: none; color: #000000; }
A.select_inner:hover { text-decoration: none; color:#FFFFFF; }

.select_inner_div { padding: 1px; color: #000000; cursor:hand; text-align:right;}
.select_inner_active { border:1px solid #6666CC; background:#000066; color: #FFFFFF; cursor:hand; text-align:right;}

</style>

/*
// Insert this code in the HTML page where you want the widget
// see http://www.flooble.com/scripts/hier.php for details on constructing the selectOptions array

<a class="select_pulldown" id="hm_1304055004" href="javascript:void(0);" onclick="openSelect(this);" onMouseover="selectMouseOver();" onMouseout="selectMouseOut();"></a><input type="hidden" id="hm_1304055004_field" name="foo" value="bar"> 
<script language="Javascript">selectMenus['hm_1304055004'] = 0; selectOptions[selectOptions.length] = '0||goo||@@0.0'; 
selectOptions[selectOptions.length] = '0||goo||@@0.1'; 
 selectRelateMenu('hm_1304055004');</script>
*/

