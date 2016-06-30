
(function(){
    function BeehiveCommand(){
        _.extend(this, {
            "command":{
                "actions": {},
                "title" : "Test title",                
                "description" : "Test description",                
                "schema" : "SmartLight",     
                "schemaVersion" : 1
            }  
        });
    }

    window.BeehiveCommand = BeehiveCommand;
})();