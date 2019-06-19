require([
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "underscore",
    "jquery",
    "splunkjs/mvc/simplexml",
    "splunkjs/mvc/layoutview",
    "splunkjs/mvc/simplexml/dashboardview",
    "splunkjs/mvc/simplexml/dashboard/panelref",
    "splunkjs/mvc/simplexml/element/chart",
    "splunkjs/mvc/simplexml/element/event",
    "splunkjs/mvc/simplexml/element/html",
    "splunkjs/mvc/simplexml/element/list",
    "splunkjs/mvc/simplexml/element/map",
    "splunkjs/mvc/simplexml/element/single",
    "splunkjs/mvc/simplexml/element/table",
    "splunkjs/mvc/simplexml/element/visualization",
    "splunkjs/mvc/simpleform/formutils",
    "splunkjs/mvc/simplexml/eventhandler",
    "splunkjs/mvc/simplexml/searcheventhandler",
    "splunkjs/mvc/simpleform/input/dropdown",
    "splunkjs/mvc/simpleform/input/radiogroup",
    "splunkjs/mvc/simpleform/input/linklist",
    "splunkjs/mvc/simpleform/input/multiselect",
    "splunkjs/mvc/simpleform/input/checkboxgroup",
    "splunkjs/mvc/simpleform/input/text",
    "splunkjs/mvc/simpleform/input/timerange",
    "splunkjs/mvc/simpleform/input/submit",
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/savedsearchmanager",
    "splunkjs/mvc/postprocessmanager",
    "splunkjs/mvc/simplexml/urltokenmodel"
    ],
    function(
        mvc,
        utils,
        TokenUtils,
        _,
        $,
        DashboardController,
        LayoutView,
        Dashboard,
        PanelRef,
        ChartElement,
        EventElement,
        HtmlElement,
        ListElement,
        MapElement,
        SingleElement,
        TableElement,
        VisualizationElement,
        FormUtils,
        EventHandler,
        SearchEventHandler,
        DropdownInput,
        RadioGroupInput,
        LinkListInput,
        MultiSelectInput,
        CheckboxGroupInput,
        TextInput,
        TimeRangeInput,
        SubmitButton,
        SearchManager,
        SavedSearchManager,
        PostProcessManager,
        UrlTokenModel
        ) {

        var pageLoading = true;

        //
        // TOKENS
        //

        // Create token namespaces
        var urlTokenModel = new UrlTokenModel();
        mvc.Components.registerInstance('url', urlTokenModel);
        var defaultTokenModel = mvc.Components.getInstance('default', {create: true});
        var submittedTokenModel = mvc.Components.getInstance('submitted', {create: true});

        urlTokenModel.on('url:navigate', function() {
            defaultTokenModel.set(urlTokenModel.toJSON());
            if (!_.isEmpty(urlTokenModel.toJSON()) && !_.all(urlTokenModel.toJSON(), _.isUndefined)) {
                submitTokens();
            } else {
                submittedTokenModel.clear();
            }
        });

        // Initialize tokens
        defaultTokenModel.set(urlTokenModel.toJSON());

        function submitTokens() {
            // Copy the contents of the defaultTokenModel to the submittedTokenModel and urlTokenModel
            FormUtils.submitForm({ replaceState: pageLoading });
        }

        function setToken(name, value) {
            defaultTokenModel.set(name, value);
            submittedTokenModel.set(name, value);
        }

        function unsetToken(name) {
            defaultTokenModel.unset(name);
            submittedTokenModel.unset(name);
        }

        //
        // SEARCH MANAGERS
        //

        var search1 = new SearchManager({
            "id": "search1",
            
            // ----------------------------- TODO -----------------------------  //

            // Change the to search the index and events you are intrested in 
            "search": "index=test_index | search LED1 = * | head 10 | table LED1 LED2 LED3 | reverse",
            "latest_time": "rtnow",
            "status_buckets": 0,
            "sample_ratio": null,
            "earliest_time": "rt-3m",
            "cancelOnUnload": true,
            "app": utils.getCurrentApp(),
            "auto_cancel": 90,
            "preview": true,
            "tokenDependencies": {
            },
            "runWhenTimeIsUndefined": false
        }, {tokens: true, tokenNamespace: "submitted"});

	function activeRed(light) {
		document.getElementById(light).style.backgroundColor = "red";
		document.getElementById(light).style.boxShadow = "0px 0px 70px red";
	}
	      
        function activeGreen(light) {
	        document.getElementById(light).style.backgroundColor = "rgb(51, 255, 51)";
	        document.getElementById(light).style.boxShadow = "0px 0px 70px rgb(51, 255, 51)";
        }
	
        var search1_data = search1.data("preview");
        search1_data.on("data", function() {

            // ----------------------------- TODO -----------------------------  //
            // Show this data on the front end
            document.getElementById("ledOutput").innerHTML = "";	
	    if(search1_data.data().rows[0][0] == 1){
		//document.getElementById("ledOutput").innerHTML += "LED1 is red.\n";
	        activeRed('light-1');
            } else {
	    	activeGreen('light-1');
	    };
            if(search1_data.data().rows[0][1] == 1){
		//document.getElementById("ledOutput").innerHTML += "LED2 is red.\n";
		activeRed('light-2');
            } else {
		activeGreen('light-2');
	    }
	    if(search1_data.data().rows[0][2] == 1){
		//document.getElementById("ledOutput").innerHTML += "LED3 is red.\n";
		activeRed('light-3');
            } else {
		activeGreen('light-3');
	    }
            console.log(typeof search1_data.data().rows);
	    console.log("NEW LINEEEEEEEE---------------------------");
	    console.log(search1_data.data().rows[0]);
	    console.log(search1_data.data().rows[0][0]);
            console.log(search1_data.data().rows);
        });

        //
        // SPLUNK LAYOUT
        //

        $('header').remove();
        new LayoutView({"hideAppBar": false, "hideChrome": false, "hideSplunkBar": false})
            .render()
            .getContainerElement()
            .appendChild($('.dashboard-body')[0]);

        //
        // DASHBOARD EDITOR
        //
        new Dashboard({
            id: 'dashboard',
            el: $('.dashboard-body'),
            showTitle: true,
            editable: true
        }, {tokens: true}).render();

        //
        // VIEWS: VISUALIZATION ELEMENTS
        //

        var element1 = new TableElement({
            "id": "element1",
            "drilldown": "none",
            "refresh.display": "progressbar",
            "managerid": "search1",
            "el": $('#element1')
        }, {tokens: true, tokenNamespace: "submitted"}).render();

        // Initialize time tokens to default
        if (!defaultTokenModel.has('earliest') && !defaultTokenModel.has('latest')) {
            defaultTokenModel.set({ earliest: '0', latest: '' });
        }
        submitTokens();
        //
        // DASHBOARD READY
        //
        DashboardController.ready();
        pageLoading = false;

    }
);
