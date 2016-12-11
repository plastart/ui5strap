/*
 * 
 * UI5Strap
 *
 * ui5strap.NavContainerStandard
 * 
 * @author Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Homepage: http://ui5strap.com
 *
 * Copyright (c) 2013 Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

sap.ui.define(['./library', 'pks/ui5strap/core/NavContainer'], function(ui5strapBs3Lib, NavContainer){
	
	"use strict";
	
	/**
	 * Constructor for a new NavContainerStandard instance.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class
	 * NavContainer with optional nav bar and sidebar.
	 * @extends pks.ui5strap.core.NavContainer
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 0.11.6
	 * 
	 * @constructor
	 * @public
	 * @alias ui5strap.NavContainerStandard
	 * 
	 */
	var NavContainerStandard = NavContainer.extend("ui5strap.NavContainerStandard", {
		metadata : {

			library : "pks.ui5strap.bs3",
			
		},

		//Use default NavContainerRenderer
		renderer : "pks.ui5strap.core.NavContainerRenderer"
	}),
	NavContainerStandardProto = NavContainerStandard.prototype;

	/**
	* @Override
	* @Protected
	*/
	NavContainerStandardProto._initNavContainer = function(){
		//NavContainer type string
		//Resulting css class is "navcontainer navcontainer-standard"
		this.ncType = "standard";

		//Default target
		this.defaultTarget = "content";

		//Available targets
		this.targets = {
			"content" : null,
			"sidebar" : null,
			"navbar" : null
		};
	};
	
	return NavContainerStandard;
});