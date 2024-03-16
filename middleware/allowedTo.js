const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText');

module.exports = (...roles) => {
    return (req, res, next) => {
        const userRole = req.currentUser.role;
        if (!(roles.includes(userRole))) {
            const err = appError.create(
                `must be  ${roles.join(" or ")} to do this action`,
                401,
                httpStatusText.FAIL
            );
            next(err);
        }
        next();
    }
}