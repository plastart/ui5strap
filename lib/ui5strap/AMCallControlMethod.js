/*
 * 
 * ui5strap
 *
 * ActionModule to call a method of a control
 * 
 * Author: Jan Philipp Knöller
 * 
 * Copyright (c) 2013 Philipp Knöller Software
 * 
 * http://ui5strap.com
 *
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

(function(){

	jQuery.sap.declare("ui5strap.AMCallControlMethod");

	ui5strap.ActionModule.extend("ui5strap.AMCallControlMethod");

	var AMCallControlMethodProto = ui5strap.AMCallControlMethod.prototype;

	/*
	* @Override
	*/
	AMCallControlMethodProto.namespace = 'callControlMethod';

	/*
	* @Override
	*/
	AMCallControlMethodProto.parameters = {
		"controlId" : {
			"required" : true, 
			"type" : "string"
		},
		"funcName" : {
			"required" : true, 
			"type" : "string"
		},
		"funcArgs" : {
			"required" : false, 
			"type" : "object"
		}
	};

	/*
	* @Override
	*/
	AMCallControlMethodProto.run = function(){
			var controlId = this.getParameter("controlId"),
				control = this.context.app.getControl(controlId),
				funcName = this.getParameter("funcName"),
				funcArgs = this.getParameter("funcArgs");
			
			if(typeof control === 'undefined'){
				throw new Error('Invalid control: ' + controlId);
			}

			if(null === funcArgs){
				funcArgs = [];
			}

			control[funcName].apply(control, funcArgs);

			this.context._log.debug("Calling control method '" + funcName + "' of control '" + control.getId() + "'");
	};

}());