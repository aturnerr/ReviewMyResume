exports.show_landing =

    (req, res) => {
        res.redirect("/dashboard");
    }

exports.show_error =

    (req, res) => {
        res.render("error");
    }

exports.show_index =

    (req, res) => {
        res.render("index");
    }
