/*
 * 
 * UI5Strap Demo App
 *
 * com.ui5strap.apps.demoapp.controllers.NewPost
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

sap.ui.define(['pks/ui5strap/viewer/Controller', "sap/ui/model/json/JSONModel"], function(Controller, JSONModel){

	var controllerImpl = {
			onUpdate : function(oEvent){
				var _this = this,
					post = oEvent.getParameter("post");
				
				this.getApp().getFeedManager().readPost(post.id, function(postData){
					_this.getView().setModel(new JSONModel(postData), "POST");
				})
				
			},
			
			onAfterRendering : function(){
				console.log("RERENDER DETAILS");
			},
			
			handleNavigateBack : function(oEvent){
				this.getApp().navigateTo(this.getApp().getRootControl(), { "id" : "contrdemoList" });
			}
	};
	
	//Return Module Constructor
	return Controller.extend("com.ui5strap.apps.demoapp.controllers.contrdemo.Detail", controllerImpl);

});