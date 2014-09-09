require([
        "dijit/form/TextBox",
        "dojo/store/Cache",
        "dojo/store/Memory",
        "dijit/form/FilteringSelect",
        "dojo/store/JsonRest"
],
    function(ready, Cache, Memory, FilteringSelect, JsonRest){

        var leStore = Cache(JsonRest({ target :
            "/path/*", idProperty: "id"
        }), Memory());

        var testStore = new Memory({data: []});

        dojo.ready(function(){

            var filt_sel = new FilteringSelect({
                id: "el_id",
                name: "el_id",
                hasDownArrow: false,
                invalidMessage: "No element found",
                searchAttr: "NAME",
                queryExpr: "${0}",
                store: testStore,
                pageSize: 10,
                labelAttr: "label",
                labelType: "html",
                onKeyUp: function(value){
                    if(dojo.byId("el_id").value.length > 4  && dijit.byId("el_id").get("store") == testStore)
                        dijit.byId("el_id").set("store", leStore);
                    if(dojo.byId("el_id").value.length <= 4  && dijit.byId("el_id").get("store") == leStore)
                        dijit.byId("el_id").set("store", testStore);
                },
                onChange: function(value){
                    dojo.byId('search').click();
                }
            }, "el_id");

        });

    });