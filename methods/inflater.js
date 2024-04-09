module.exports = function (/*Buffer*/ inbuf) {
    var zlib = require("zlib");

    return {
        inflate: function (expectedLength) {
            return zlib.inflateRawSync(inbuf, { maxOutputLength: expectedLength });
        },

        inflateAsync: function (/*Function*/ callback, expectedLength) {
            var tmp = zlib.createInflateRaw({ maxOutputLength: expectedLength }),
                parts = [],
                total = 0;
            tmp.on("data", function (data) {
                parts.push(data);
                total += data.length;
            });
            tmp.on("end", function () {
                var buf = Buffer.alloc(total),
                    written = 0;
                buf.fill(0);
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    part.copy(buf, written);
                    written += part.length;
                }
                callback && callback(buf);
            });
            tmp.end(inbuf);
        }
    };
};
