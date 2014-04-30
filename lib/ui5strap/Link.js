/*
 * 
 * UI5Strap
 *
 * Link
 * 
 * Author: Jan Philipp Knöller
 * 
 * Copyright (c) 2013 Jan Philipp Knöller
 * 
 * http://pksoftware.de
 *
 * Get the latest version: https://github.com/pks5/ui5strap
 * 
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

(function(){

	jQuery.sap.declare("ui5strap.Link");

	sap.ui.core.Control.extend("ui5strap.Link", {
		metadata : {

			// ---- object ----
			defaultAggregation : "content",
			// ---- control specific ----
			library : "ui5strap",

			properties : { 
				text : {
					type:"string", 
					defaultValue:""
				},
				href : {
					type:"string", 
					defaultValue:""
				},
				target  : {
					type:"string", 
					defaultValue : ""
				}			
			},
			aggregations : { 
				content : {
					singularName: "content"
				}
			},
			events:{
		        click: {},
		        tap : {}
		    }

		}
	});

	if(ui5strap.options.enableTapEvents){
		ui5strap.Link.prototype.ontap = function(){
			this.fireTap();
		};
	}

	if(ui5strap.options.enableClickEvents){
		ui5strap.Link.prototype.onclick = function(){
			this.fireClick();
		};
	}

}());