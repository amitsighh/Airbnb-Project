const User = require("../models/user.js");
module.exports.renderSignupForm =  (req, res) => {
res.render("users/signup")
};

module.exports.signup = async(req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to WanderLust!");
        return res.redirect("/listings");
    });
} catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
}
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect(res.locals.redirectUrl || "/listings");
    delete req.session.redirectUrl; // Clear redirect URL after login
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are Logged Out!");
        res.redirect("/listings");
    })
};

// Using MVC Framework!