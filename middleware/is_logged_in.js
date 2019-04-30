module.exports =

    function isLoggedIn(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
