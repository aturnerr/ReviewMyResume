exports.show_landing_page = 

    function(req, res){
        res.redirect("/dashboard");
    }

exports.show_error_page = 

    function(req, res){
        res.render("error");
    }