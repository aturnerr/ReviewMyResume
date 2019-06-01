module.exports =

    // checks if a user is currently logged in
    function isLoggedIn(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Please login first!");
        res.redirect("/login");
    }
