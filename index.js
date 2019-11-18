/**
 * POSTCSS RGB
 * A postcss plugin to use rgb and rgba with hex values
 * version          1.1.0
 * author           Arpad Hegedus <hegedus.arpad@gmail.com>
 */

// load dependencies
const postcss = require('postcss');
const util = require('postcss-plugin-utilities');

const regexps = {
    rgb: /rgb\(([^\,\)]+)\)/ig,
    rgba: /rgba\(([^\,\)]+)(\,([\s]+)?[^\)\,]+)\)/ig,
    cssVariable: (/(--(.+))/),
};

// export plugin
module.exports = postcss.plugin('postcss-rgb', (options = {}) => {
    const isRgbInDeclaration = decl => {
        return decl.value.indexOf('rgb(') >= 0 || decl.value.indexOf('rgba(') >= 0;
    };

    return css => {
        css.walkDecls(decl => {
            if(!isRgbInDeclaration(decl)) {
                return;
            }

            const isCssVariable = regexps.cssVariable.test(decl.prop);

            // parse rgba values
            decl.value = decl.value.replace(regexps.rgba, (str, clr, alpha = null) => {
                clr = clr.trim();
                clrName = util.nameToHex(clr);
                if (clrName) { clr = clrName; }
                clrHex = util.hexToRGB(clr);
                clr = (clrHex)? clrHex : {r: '204', g: '204', b: '204'};

                const colorValue = `${clr.r}, ${clr.g}, ${clr.b}${alpha}`;

                if(options.suppressPrefixes) {
                    return colorValue;
                }

                return `rgba(${colorValue})`;
            });

            // parse rgb values
            decl.value = decl.value.replace(regexps.rgb, (str, clr) => {
                clr = clr.trim();
                clrName = util.nameToHex(clr);
                if (clrName) { clr = clrName; }
                clrHex = util.hexToRGB(clr);
                clr = (clrHex)? clrHex : {r: '204', g: '204', b: '204'};

                const colorValue = `${clr.r}, ${clr.g}, ${clr.b}`;

                if(options.suppressPrefixes) {
                    return colorValue;
                }

                return `rgb(${colorValue})`;
            });
        });
    }
});