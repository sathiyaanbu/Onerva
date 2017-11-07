var onerva = { error: {} };

onerva.error.OnervaError = function (reason, context) {
    this.name = 'OnervaError';
    this.message = reason || 'Unknown error';
    this.context = context;
    this.stack = (new Error()).stack;
}

onerva.error.OnervaError.prototype = Object.create(Error.prototype);
onerva.error.OnervaError.prototype.constructor = onerva.error.OnervaError;

module.exports = onerva.error;
