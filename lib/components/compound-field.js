var _jsxFileName = "src/components/compound-field.js",
    _this = this;

import React from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import uid from "uid";

var styles = {
  base: uid(10) // Empty placeholder class
};

var CompoundField = function CompoundField(_ref) {
  var children = _ref.children;

  return React.createElement(
    "div",
    { className: styles.base, "data-compound-field": true, __source: {
        fileName: _jsxFileName,
        lineNumber: 11
      },
      __self: _this
    },
    children
  );
};

CompoundField.propTypes = {
  children: ImmutablePropTypes.list
};

export default CompoundField;
export var CompoundFieldFactory = React.createFactory(CompoundField);