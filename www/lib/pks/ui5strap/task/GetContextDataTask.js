/*
 * 
 * UI5Strap
 *
 * pks.ui5strap.task.GetContextDataTask
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

sap.ui.define(["./library", "../viewer/Task"], function(ui5strapTaskLib, ActionModule){
	
	"use strict";
	
	/**
	 * Constructor for a new GetContextDataTask instance.
	 * 
	 * @param {object} mSettings The task settings.
	 * @param {pks.ui5strap.viewer.ActionContext} oActionContext The action context to run the task on.
	 * 
	 * @class
	 * Gets the context data.
	 * @extends pks.ui5strap.viewer.Task
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 0.11.6
	 * 
	 * @constructor
	 * @public
	 * @alias pks.ui5strap.task.GetContextDataTask
	 * 
	 */
	var GetContextDataTask = ActionModule.extend("pks.ui5strap.task.GetContextDataTask"),
	/**
	 * @alias pks.ui5strap.task.GetContextDataTask.prototype
	 */
		GetContextDataTaskProto = GetContextDataTask.prototype;

	/*
	* @Override
	*/
	GetContextDataTaskProto.parameters = {
		
		//Required
		"modelName" : {
			"required" : true, 
			"type" : "string"
		},
		"tgtParam" : {
			"required" : true, 
			"type" : "string"
		},
		
		//Optional
		"controlId" : {
			"required" : false, 
			"type" : "string"
		},
		"viewId" : {
			"required" : false,
			"defaultValue" : null,
			"type" : "string"
		},
		"parameterKey" : {
			"required" : false,
			"defaultValue" : null,
			"type" : "string"
		},
		"scope" : {
			"required" : false, 
			"defaultValue" : "APP", 
			"type" : "string"
		}
		
	};

	/*
	* Run the ActionModule
	* @override
	*/
	GetContextDataTaskProto.run = function(){
			var modelName = this.getParameter("modelName"),
				tgtParam = this.getParameter("tgtParam"),
				control = this.findControl();

			var bindingContext = control.getBindingContext(modelName);
			var model = bindingContext.getModel();
			var data = model.getProperty(bindingContext.getPath());

			this.context.set(this, tgtParam, data);
			
			this.then();
	};
	
	//Legacy
	GetContextDataTaskProto.completed = function(){};

	return GetContextDataTask;
});