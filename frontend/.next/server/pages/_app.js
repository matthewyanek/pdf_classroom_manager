/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/contexts/ThemeContext.tsx":
/*!***************************************!*\
  !*** ./src/contexts/ThemeContext.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ThemeProvider: () => (/* binding */ ThemeProvider),\n/* harmony export */   useTheme: () => (/* binding */ useTheme)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n// src/contexts/ThemeContext.tsx\n\n\nconst ThemeContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    darkMode: true,\n    toggleTheme: ()=>{}\n});\nconst ThemeProvider = ({ children })=>{\n    // Check localStorage or use system preference as default\n    const [darkMode, setDarkMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>{\n        // Check if we're in the browser environment\n        if (false) {}\n        // Default to dark mode\n        return true;\n    });\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Update localStorage when theme changes\n        localStorage.setItem(\"theme\", darkMode ? \"dark\" : \"light\");\n        // Apply or remove the 'dark' class on the html element\n        if (darkMode) {\n            document.documentElement.classList.add(\"dark\");\n        } else {\n            document.documentElement.classList.remove(\"dark\");\n        }\n    }, [\n        darkMode\n    ]);\n    const toggleTheme = ()=>{\n        setDarkMode(!darkMode);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(ThemeContext.Provider, {\n        value: {\n            darkMode,\n            toggleTheme\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\yanekm\\\\Desktop\\\\PDF File System\\\\frontend\\\\src\\\\contexts\\\\ThemeContext.tsx\",\n        lineNumber: 48,\n        columnNumber: 5\n    }, undefined);\n};\nconst useTheme = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ThemeContext);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dHMvVGhlbWVDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxnQ0FBZ0M7O0FBQzhDO0FBTzlFLE1BQU1LLDZCQUFlSixvREFBYUEsQ0FBbUI7SUFDbkRLLFVBQVU7SUFDVkMsYUFBYSxLQUFPO0FBQ3RCO0FBRU8sTUFBTUMsZ0JBQXlELENBQUMsRUFBRUMsUUFBUSxFQUFFO0lBQ2pGLHlEQUF5RDtJQUN6RCxNQUFNLENBQUNILFVBQVVJLFlBQVksR0FBR1IsK0NBQVFBLENBQUM7UUFDdkMsNENBQTRDO1FBQzVDLElBQUksS0FBa0IsRUFBYSxFQU9sQztRQUVELHVCQUF1QjtRQUN2QixPQUFPO0lBQ1Q7SUFFQUMsZ0RBQVNBLENBQUM7UUFDUix5Q0FBeUM7UUFDekNTLGFBQWFLLE9BQU8sQ0FBQyxTQUFTWCxXQUFXLFNBQVM7UUFFbEQsdURBQXVEO1FBQ3ZELElBQUlBLFVBQVU7WUFDWlksU0FBU0MsZUFBZSxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQztRQUN6QyxPQUFPO1lBQ0xILFNBQVNDLGVBQWUsQ0FBQ0MsU0FBUyxDQUFDRSxNQUFNLENBQUM7UUFDNUM7SUFDRixHQUFHO1FBQUNoQjtLQUFTO0lBRWIsTUFBTUMsY0FBYztRQUNsQkcsWUFBWSxDQUFDSjtJQUNmO0lBRUEscUJBQ0UsOERBQUNELGFBQWFrQixRQUFRO1FBQUNDLE9BQU87WUFBRWxCO1lBQVVDO1FBQVk7a0JBQ25ERTs7Ozs7O0FBR1AsRUFBRTtBQUVLLE1BQU1nQixXQUFXLElBQU1yQixpREFBVUEsQ0FBQ0MsY0FBYyIsInNvdXJjZXMiOlsid2VicGFjazovL3BkZi1jbGFzc3Jvb20tbWFuYWdlci8uL3NyYy9jb250ZXh0cy9UaGVtZUNvbnRleHQudHN4PzdlMjMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2NvbnRleHRzL1RoZW1lQ29udGV4dC50c3hcclxuaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XHJcblxyXG50eXBlIFRoZW1lQ29udGV4dFR5cGUgPSB7XHJcbiAgZGFya01vZGU6IGJvb2xlYW47XHJcbiAgdG9nZ2xlVGhlbWU6ICgpID0+IHZvaWQ7XHJcbn07XHJcblxyXG5jb25zdCBUaGVtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0PFRoZW1lQ29udGV4dFR5cGU+KHtcclxuICBkYXJrTW9kZTogdHJ1ZSxcclxuICB0b2dnbGVUaGVtZTogKCkgPT4ge30sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IFRoZW1lUHJvdmlkZXI6IFJlYWN0LkZDPHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9PiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcclxuICAvLyBDaGVjayBsb2NhbFN0b3JhZ2Ugb3IgdXNlIHN5c3RlbSBwcmVmZXJlbmNlIGFzIGRlZmF1bHRcclxuICBjb25zdCBbZGFya01vZGUsIHNldERhcmtNb2RlXSA9IHVzZVN0YXRlKCgpID0+IHtcclxuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGluIHRoZSBicm93c2VyIGVudmlyb25tZW50XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgY29uc3Qgc2F2ZWRUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpO1xyXG4gICAgICBcclxuICAgICAgLy8gUmV0dXJuIHNhdmVkIHByZWZlcmVuY2UsIG9yIHVzZSBzeXN0ZW0gcHJlZmVyZW5jZSwgb3IgZGVmYXVsdCB0byBkYXJrXHJcbiAgICAgIHJldHVybiBzYXZlZFRoZW1lIFxyXG4gICAgICAgID8gc2F2ZWRUaGVtZSA9PT0gJ2RhcmsnIFxyXG4gICAgICAgIDogd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBEZWZhdWx0IHRvIGRhcmsgbW9kZVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAvLyBVcGRhdGUgbG9jYWxTdG9yYWdlIHdoZW4gdGhlbWUgY2hhbmdlc1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgZGFya01vZGUgPyAnZGFyaycgOiAnbGlnaHQnKTtcclxuICAgIFxyXG4gICAgLy8gQXBwbHkgb3IgcmVtb3ZlIHRoZSAnZGFyaycgY2xhc3Mgb24gdGhlIGh0bWwgZWxlbWVudFxyXG4gICAgaWYgKGRhcmtNb2RlKSB7XHJcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGFyaycpO1xyXG4gICAgfVxyXG4gIH0sIFtkYXJrTW9kZV0pO1xyXG5cclxuICBjb25zdCB0b2dnbGVUaGVtZSA9ICgpID0+IHtcclxuICAgIHNldERhcmtNb2RlKCFkYXJrTW9kZSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxUaGVtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgZGFya01vZGUsIHRvZ2dsZVRoZW1lIH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L1RoZW1lQ29udGV4dC5Qcm92aWRlcj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVzZVRoZW1lID0gKCkgPT4gdXNlQ29udGV4dChUaGVtZUNvbnRleHQpOyJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZUNvbnRleHQiLCJUaGVtZUNvbnRleHQiLCJkYXJrTW9kZSIsInRvZ2dsZVRoZW1lIiwiVGhlbWVQcm92aWRlciIsImNoaWxkcmVuIiwic2V0RGFya01vZGUiLCJzYXZlZFRoZW1lIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwic2V0SXRlbSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZVRoZW1lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/contexts/ThemeContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/ThemeContext */ \"./src/contexts/ThemeContext.tsx\");\n// pages/_app.tsx\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_ThemeContext__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"C:\\\\Users\\\\yanekm\\\\Desktop\\\\PDF File System\\\\frontend\\\\src\\\\pages\\\\_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\yanekm\\\\Desktop\\\\PDF File System\\\\frontend\\\\src\\\\pages\\\\_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUJBQWlCOztBQUNjO0FBRTBCO0FBRXpELFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDL0MscUJBQ0UsOERBQUNILGlFQUFhQTtrQkFDWiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QjtBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGRmLWNsYXNzcm9vbS1tYW5hZ2VyLy4vc3JjL3BhZ2VzL19hcHAudHN4P2Y5ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvX2FwcC50c3hcclxuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xyXG5pbXBvcnQgeyBUaGVtZVByb3ZpZGVyIH0gZnJvbSAnLi4vY29udGV4dHMvVGhlbWVDb250ZXh0JztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcclxuICByZXR1cm4gKFxyXG4gICAgPFRoZW1lUHJvdmlkZXI+XHJcbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgIDwvVGhlbWVQcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsiXSwibmFtZXMiOlsiVGhlbWVQcm92aWRlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();