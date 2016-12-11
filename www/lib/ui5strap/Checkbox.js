/*
 * 
 * UI5Strap
 *
 * ui5strap.Checkbox
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

sap.ui.define(['./library', "pks/ui5strap/core/ControlBase"], function(ui5strapBs3Lib, ControlBase){
	
	"use strict";
	
	/**
	 * Constructor for a new Checkbox instance.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class
	 * Control for creating Bootstrap checkboxes.
	 * @extends ui5strap.ControlBase
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 0.11.6
	 * 
	 * @constructor
	 * @public
	 * @alias ui5strap.Checkbox
	 * 
	 */
	var Checkbox = ControlBase.extend("ui5strap.Checkbox", {
		metadata : {
			interfaces : ["pks.ui5strap.bs3.IInputGroupAddon"],
			library : "ui5strap",
			
			properties : { 
				type : {
					type:"ui5strap.CheckboxType", 
					defaultValue:ui5strap.CheckboxType.Block
				},
				value : {
					type:"string", 
					defaultValue:""
				},
				label : {
					type:"string", 
					defaultValue:""
				},
				selected : {
					type : "boolean",
					defaultValue : false
				}
			}

		},
		
		renderer : function(rm, oControl) {
			var type = oControl.getType(),
				typeBlock = ui5strap.CheckboxType.Block,
				inInputGroup = oControl.getParent().getMetadata().isInstanceOf("pks.ui5strap.bs3.IInputGroup");

			if(!inInputGroup){
				if(type === typeBlock){
					rm.write("<div");
					rm.writeControlData(oControl);
					rm.addClass('checkbox');
					rm.writeClasses();
					rm.write(">");
				}
			
				rm.write("<label");
				if(type === ui5strap.CheckboxType.Inline){
					rm.writeControlData(oControl);
					rm.addClass('checkbox-inline');
				}
				rm.writeClasses();
				rm.write(">");
			}
			
			rm.write('<input')
			if(inInputGroup || type === ui5strap.CheckboxType.Default){
				rm.writeControlData(oControl);
			}
			else{
				rm.writeAttribute('id', oControl.getId() + '---checkbox');
			}
			rm.writeAttribute('type', 'checkbox');
			rm.writeAttribute('value', oControl.getValue());
			rm.writeClasses();
			if(oControl.getSelected()){
				rm.writeAttribute('checked', 'checked');
			}
			rm.write('/>');
			
			rm.writeEscaped(oControl.getLabel());

			if(!inInputGroup){
				rm.write("</label>");

				if(type === typeBlock){
					rm.write("</div>");
				}
			}
		}
	}),
	CheckboxProto = Checkbox.prototype;

	var _onChange = function(_this){
		return function(ev){
			var inputValue = _this.$checkbox.prop('checked');
			if(inputValue !== _this.getSelected()){ 
				_this.setProperty("selected", inputValue, true);
			}
		}
	};

	CheckboxProto.onAfterRendering = function(){
		this.$checkbox = this.$().find('#' + this.getId() + '---checkbox');
		this.$checkbox.on('change', _onChange(this));
	};

	CheckboxProto.onBeforeRendering = function() {
		if (this.getDomRef()) {
			this.$checkbox.off();
			//this._curpos = this._$input.cursorPos();
		}
	};

	CheckboxProto.setSelected = function(sValue) {
		sValue = this.validateProperty("selected", sValue);
		
		if (sValue != this.getSelected()) {
			this.setProperty("selected", sValue, true);
			if (this.getDomRef() && this.$checkbox.prop('checked') != sValue) {
				this.$checkbox.prop('checked', sValue);
			}
		}
		return this;
	};
	
	return Checkbox;
});