module.exports =

    function isLoggedIn(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        res.flash("error", "Please login first!");
        res.redirect("/login");
    }
