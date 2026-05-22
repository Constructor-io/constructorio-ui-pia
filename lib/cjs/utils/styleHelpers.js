"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferredColorScheme = void 0;
function getPreferredColorScheme() {
    var _a;
    let colorScheme = 'light';
    // Check if the dark-mode Media-Query matches
    if ((_a = window.matchMedia('(prefers-color-scheme: dark)')) === null || _a === void 0 ? void 0 : _a.matches) {
        colorScheme = 'dark';
    }
    return colorScheme;
}
exports.getPreferredColorScheme = getPreferredColorScheme;
