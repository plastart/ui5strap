jQuery.sap.require('ui5strap.Action');

sap.ui.controller("com_mycompany.my_app.controllers.Page3", {

	app : liberty.getViewer().getApp(),

	switchTheme : function(oEvent){
		var btn = oEvent.getSource();

		if(!this.activeButton){
			this.activeButton = this.getView().byId('defaultThemeButton');
		}

		if(btn !== this.activeButton){
			this.activeButton.setSelected(false);
			
			btn.setSelected(true);
			
			this.activeButton = btn;

			this.setTheme(btn.getCustomData()[0].getValue('theme'));
		}
		
	},

	setTheme : function(newTheme){
		var app = this.app;

		ui5strap.Action.run({
			"parameters" : {
				"a_modules" : "ui5strap.AMChangeTheme",
				"changeTheme" : {
					theme : newTheme
				}
			},
			"app" : this.getView().getViewData().app,
			"controller" : this
		});
	},

	toggleSidebar : function(oEvent){
		var srcButton = oEvent.getSource();

		srcButton.setSelected(!srcButton.getSelected());

		var frame = this.getView().getViewData().app.getFrame();

		frame.getNavContainer().setOptionsEnabled({
			"sidebar" : srcButton.getSelected()
		});
	},

	toggleSidenav : function(oEvent){
		var srcButton = oEvent.getSource();

		srcButton.setSelected(!srcButton.getSelected());

		var frame = this.getView().getViewData().app.getFrame();

		frame.getNavContainer().setOptionsEnabled({
			"sidenav" : srcButton.getSelected()
		});
	},

	toggleSidebarOptions : function(oEvent){
		var srcButton = oEvent.getSource();

		var text = oEvent.getParameter("button").getText();

		var frame = this.getView().getViewData().app.getFrame();

		var options = {
			"sidebar2bottom" : false,
			"sidebar2nav" : false
		};

		if(text !== 'none'){
			options[text] = true;
		}

		frame.getNavContainer().setOptionsEnabled(options);
	},

	toggleNavbar : function(oEvent){
		var srcButton = oEvent.getSource();

		srcButton.setSelected(!srcButton.getSelected());

		var frame = this.getView().getViewData().app.getFrame();

		frame.getNavContainer().setOptionsEnabled({
			"navbar" : srcButton.getSelected()
		});
	}
	
});