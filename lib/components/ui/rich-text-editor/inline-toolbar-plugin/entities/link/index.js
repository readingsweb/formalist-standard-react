var _jsxFileName = "src/components/ui/rich-text-editor/inline-toolbar-plugin/entities/link/index.js";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Entity } from "draft-js";
import uid from "uid";
// Components
import Input from "../../../../input";
import Checkbox from "../../../../checkbox";
import Label from "../../../../label";
import * as styles from "./styles";

var Link = function (_Component) {
  _inherits(Link, _Component);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, (Link.__proto__ || Object.getPrototypeOf(Link)).apply(this, arguments));
  }

  _createClass(Link, [{
    key: "render",
    value: function render() {
      var _Entity$get$getData = Entity.get(this.props.entityKey).getData(),
          url = _Entity$get$getData.url;

      return React.createElement(
        "a",
        { href: url, title: url, __source: {
            fileName: _jsxFileName,
            lineNumber: 15
          },
          __self: this
        },
        this.props.children
      );
    }
  }]);

  return Link;
}(Component);

Link.propTypes = {
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && Entity.get(entityKey).getType().toLowerCase() === "link";
  }, callback);
}

var decorator = {
  strategy: findLinkEntities,
  component: Link
};

var ActionHandler = function (_Component2) {
  _inherits(ActionHandler, _Component2);

  function ActionHandler(props) {
    _classCallCheck(this, ActionHandler);

    var _this2 = _possibleConstructorReturn(this, (ActionHandler.__proto__ || Object.getPrototypeOf(ActionHandler)).call(this, props));

    var entityKey = props.entityKey;

    var entity = Entity.get(entityKey);
    var entityData = entity.getData();
    // And absence of data means we want to edit it immediately
    _this2.state = {
      id: uid(10),
      editing: entityData.url == null,
      changeData: entityData
    };
    _this2.persistPopover = _this2.persistPopover.bind(_this2);
    _this2.onChange = _this2.onChange.bind(_this2);
    _this2.onSubmit = _this2.onSubmit.bind(_this2);
    return _this2;
  }

  _createClass(ActionHandler, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var entityKey = this.props.entityKey;

      var entity = Entity.get(entityKey);
      var entityData = entity.getData();
      if (entityData.url == null) {
        this.persistPopover();
      }
    }

    // TODO: Ideally we focus on load when we‘re creating a link for the first
    // time, but unfortunately there’s no simple hook for this because
    // componentDidMount gets called whenever the selection changes for some
    // reason

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // If we change from not to editing, focus the input
      if (this._url) {
        var input = this._url.getInput();
        if (input && this.state.editing === true && prevState.editing === false) {
          input.focus();
        }
      }
    }
  }, {
    key: "persistPopover",
    value: function persistPopover() {
      var forceVisible = this.props.forceVisible;

      forceVisible(true);
    }
  }, {
    key: "unpersistPopover",
    value: function unpersistPopover() {
      var forceVisible = this.props.forceVisible;

      forceVisible(false);
    }
  }, {
    key: "handleEdit",
    value: function handleEdit() {
      this.persistPopover();
      this.setState({
        editing: true
      });
    }
  }, {
    key: "onChange",
    value: function onChange(key, e, value) {
      var changeData = this.state.changeData;


      var newChangeData = Object.assign({}, changeData, _defineProperty({}, "" + key, value));
      this.setState({
        changeData: newChangeData
      });
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      e.preventDefault();
      var _props = this.props,
          onChange = _props.onChange,
          editorState = _props.editorState,
          entityKey = _props.entityKey;
      var changeData = this.state.changeData;

      Entity.replaceData(entityKey, changeData);
      this.setState({
        editing: false
      });
      this.unpersistPopover();
      onChange(editorState, true);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          entityKey = _props2.entityKey,
          remove = _props2.remove;
      var _state = this.state,
          changeData = _state.changeData,
          editing = _state.editing,
          id = _state.id;

      var entity = Entity.get(entityKey);
      // TODO Asses whether to remove this binding
      /* eslint-disable react/jsx-no-bind */
      return React.createElement(
        "div",
        {
          ref: function ref(r) {
            _this3._container = r;
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 136
          },
          __self: this
        },
        editing ? React.createElement(
          "form",
          { onSubmit: this.onSubmit, __source: {
              fileName: _jsxFileName,
              lineNumber: 142
            },
            __self: this
          },
          React.createElement(
            "div",
            { className: styles.field, __source: {
                fileName: _jsxFileName,
                lineNumber: 143
              },
              __self: this
            },
            React.createElement(
              Label,
              { className: styles.label, htmlFor: "url-" + id, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 144
                },
                __self: this
              },
              "Link"
            ),
            React.createElement(Input, {
              value: changeData.url,
              name: "url-" + id,
              onChange: this.onChange.bind(this, "url"),
              placeholder: "http://",
              ref: function ref(r) {
                _this3._url = r;
              },
              size: "small",
              type: "text",
              __source: {
                fileName: _jsxFileName,
                lineNumber: 147
              },
              __self: this
            })
          ),
          React.createElement(
            "div",
            { className: styles.field, __source: {
                fileName: _jsxFileName,
                lineNumber: 159
              },
              __self: this
            },
            React.createElement(
              Label,
              { className: styles.label, htmlFor: "title-" + id, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 160
                },
                __self: this
              },
              "Title"
            ),
            React.createElement(Input, {
              value: changeData.title,
              name: "title-" + id,
              onChange: this.onChange.bind(this, "title"),
              placeholder: "Description of link",
              size: "small",
              type: "text",
              __source: {
                fileName: _jsxFileName,
                lineNumber: 163
              },
              __self: this
            })
          ),
          React.createElement(
            "div",
            { className: styles.fieldCheckbox, __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              },
              __self: this
            },
            React.createElement(Checkbox, {
              defaultChecked: changeData.newWindow === true,
              label: "Open in new window?",
              name: "newWindow-" + id,
              onChange: this.onChange.bind(this, "newWindow"),
              __source: {
                fileName: _jsxFileName,
                lineNumber: 173
              },
              __self: this
            })
          ),
          React.createElement(
            "div",
            { className: styles.actions, __source: {
                fileName: _jsxFileName,
                lineNumber: 180
              },
              __self: this
            },
            React.createElement(
              "button",
              { className: styles.saveButton, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 181
                },
                __self: this
              },
              "Save link"
            )
          )
        ) : React.createElement(
          "div",
          { className: styles.displayWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 185
            },
            __self: this
          },
          React.createElement(
            "a",
            {
              href: changeData.url,
              target: "_blank",
              className: styles.handlerUrl,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 186
              },
              __self: this
            },
            changeData.url
          ),
          React.createElement(
            "button",
            {
              className: styles.editButton,
              onClick: function onClick(e) {
                e.preventDefault();
                _this3.handleEdit();
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 193
              },
              __self: this
            },
            "Change"
          ),
          React.createElement(
            "button",
            {
              className: styles.removeButton,
              onClick: function onClick(e) {
                e.preventDefault();
                remove(entity);
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 202
              },
              __self: this
            },
            React.createElement(
              "span",
              { className: styles.removeText, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 209
                },
                __self: this
              },
              "Remove"
            ),
            React.createElement(
              "span",
              { className: styles.removeX, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 210
                },
                __self: this
              },
              "\xD7"
            )
          )
        )
      );
      /* eslint-enable react/jsx-no-bind */
    }
  }]);

  return ActionHandler;
}(Component);

ActionHandler.propTypes = {
  entityKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  forceVisible: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired
};

export default {
  handler: ActionHandler,
  decorator: decorator
};