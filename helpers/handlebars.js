module.exports = {
    range: function(from, to, block) {
        var accum = '';
        for(var i = from; i <= to; ++i) {
          accum += block.fn(i);
        }
        return accum;
      },
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
};