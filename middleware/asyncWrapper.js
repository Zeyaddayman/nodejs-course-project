module.exports = (asycnFn) => {
    return (req, res, next) => {
        asycnFn(req, res, next).catch((err) => {
            next(err);
        })
    }
}