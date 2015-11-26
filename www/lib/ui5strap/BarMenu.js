/*
 * 
 * UI5Strap
 *
 * ui5strap.ListGroup
 * 
 * @author Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Homepage: http://ui5strap.com
 *
 * Copyright (c) 2013-2014 Jan Philipp Knöller <info@pksoftware.de>
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

(function(){

	jQuery.sap.declare("ui5strap.BarMenu");
	jQuery.sap.require("ui5strap.ListBase");
	jQuery.sap.require("ui5strap.BarMenuItem");

	ui5strap.ListBase.extend("ui5strap.BarMenu", {
		metadata : {

			library : "ui5strap",
			
			properties : { 
				"inverse" : {
					type:"boolean", 
					defaultValue:false
				},
				
				"zoomExtraSmall" : {
					type:"int",
					defaultValue : 0
				},
				
				zoomSmall : {
					type : "int",
					defaultValue : 0
				},
				
				zoomMedium : {
					type : "int",
					defaultValue : 0
				},
				
				zoomLarge : {
					type : "int",
					defaultValue : 0
				},
				
				typeExtraSmall : {
					type : "ui5strap.BarMenuType",
					defaultValue : ui5strap.BarMenuType.ListVertical
				},
				
				typeSmall : {
					type : "ui5strap.BarMenuType",
					defaultValue : ui5strap.BarMenuType.Default
				},
				
				typeMedium : {
					type : "ui5strap.BarMenuType",
					defaultValue : ui5strap.BarMenuType.Default
				},
				
				typeLarge : {
					type : "ui5strap.BarMenuType",
					defaultValue : ui5strap.BarMenuType.Default
				}
			},
			
			aggregations : { 
				items : {
					type : "ui5strap.BarMenuItem",
					singularName: "item"
				} 
			}

		}
	});
	
}());