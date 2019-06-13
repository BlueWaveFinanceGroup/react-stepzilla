"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _promise = _interopRequireDefault(require("promise"));

var StepZilla =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2["default"])(StepZilla, _Component);

  function StepZilla(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, StepZilla);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(StepZilla).call(this, props));
    _this.state = {
      compState: _this.props.startAtStep,
      navState: _this.getNavStates(_this.props.startAtStep, _this.props.steps.length)
    };
    _this.hidden = {
      display: 'none'
    }; // if user did not give a custom nextTextOnFinalActionStep, the nextButtonText becomes the default

    _this.nextTextOnFinalActionStep = _this.props.nextTextOnFinalActionStep ? _this.props.nextTextOnFinalActionStep : _this.props.nextButtonText;

    _this.applyValidationFlagsToSteps();

    return _this;
  }

  (0, _createClass2["default"])(StepZilla, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.currentStep !== this.props.currentStep) {
        this.setState({
          compState: this.props.currentStep,
          navState: this.getNavStates(this.props.currentStep, this.props.steps.length)
        });
      }
    } // extend the "steps" array with flags to indicate if they have been validated

  }, {
    key: "applyValidationFlagsToSteps",
    value: function applyValidationFlagsToSteps() {
      var _this2 = this;

      this.props.steps.map(function (i, idx) {
        if (_this2.props.dontValidate) {
          i.validated = true;
        } else {
          // check if isValidated was exposed in the step, if yes then set initial state as not validated (false) or vice versa
          // if HOCValidation is used for the step then mark it as "requires to be validated. i.e. false"
          i.validated = typeof i.component.type === 'undefined' || typeof i.component.type.prototype.isValidated === 'undefined' && !_this2.isStepAtIndexHOCValidationBased(idx) ? true : false;
        }

        return i;
      });
    } // update the header nav states via classes so they can be styled via css

  }, {
    key: "getNavStates",
    value: function getNavStates(indx, length) {
      var styles = [];

      for (var i = 0; i < length; i++) {
        if (i < indx) {
          styles.push('done');
        } else if (i === indx) {
          styles.push('doing');
        } else {
          styles.push('todo');
        }
      }

      return {
        current: indx,
        styles: styles
      };
    }
  }, {
    key: "getPrevNextBtnLayout",
    value: function getPrevNextBtnLayout(currentStep) {
      // first set default values
      var showPreviousBtn = true;
      var showNextBtn = true;
      var nextStepText = this.props.nextButtonText; // first step hide previous btn

      if (currentStep === 0) {
        showPreviousBtn = false;
      } // second to last step change next btn text if supplied as props


      if (currentStep === this.props.steps.length - 2) {
        nextStepText = this.props.nextTextOnFinalActionStep || nextStepText;
      } // last step hide next btn, hide previous btn if supplied as props


      if (currentStep >= this.props.steps.length - 1) {
        showNextBtn = false;
        showPreviousBtn = this.props.prevBtnOnLastStep === false ? false : true;
      }

      return {
        showPreviousBtn: showPreviousBtn,
        showNextBtn: showNextBtn,
        nextStepText: nextStepText
      };
    } // which step are we in?

  }, {
    key: "checkNavState",
    value: function checkNavState(nextStep) {
      if (this.props.onStepChange) {
        this.props.onStepChange(nextStep);
      }
    } // set the nav state

  }, {
    key: "setNavState",
    value: function () {
      var _setNavState = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(next) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.props.onBeforeStepChange) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.props.onBeforeStepChange(this.state.compState, next);

              case 3:
                if (!this.props.dontAllowStepMoves) {
                  this.setState({
                    navState: this.getNavStates(next, this.props.steps.length)
                  });

                  if (next < this.props.steps.length) {
                    this.setState({
                      compState: next
                    });
                  }

                  this.checkNavState(next);
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setNavState(_x) {
        return _setNavState.apply(this, arguments);
      }

      return setNavState;
    }() // handles keydown on enter being pressed in any Child component input area. in this case it goes to the next (ignore textareas as they should allow line breaks)

  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(evt) {
      if (evt.which === 13) {
        if (!this.props.preventEnterSubmission && evt.target.type !== 'textarea') {
          this.next();
        } else if (evt.target.type !== 'textarea') {
          evt.preventDefault();
        }
      }
    } // this utility method lets Child components invoke a direct jump to another step

  }, {
    key: "jumpToStep",
    value: function jumpToStep(evt) {
      var _this3 = this;

      if (typeof evt.target === 'undefined') {
        // a child step wants to invoke a jump between steps. in this case 'evt' is the numeric step number and not the JS event
        this.setNavState(evt);
      } else {
        // the main navigation step ui is invoking a jump between steps
        var targetValue = evt.currentTarget.value; // if stepsNavigation is turned off or user clicked on existing step again (on step 2 and clicked on 2 again) then ignore

        if (!this.props.stepsNavigation || targetValue === this.state.compState) {
          evt.preventDefault();
          evt.stopPropagation();
          return;
        } // evt is a react event so we need to persist it as we deal with aync promises which nullifies these events (https://facebook.github.io/react/docs/events.html#event-pooling)


        evt.persist();
        var movingBack = targetValue < this.state.compState; // are we trying to move back or front?

        var passThroughStepsNotValid = false; // if we are jumping forward, only allow that if inbetween steps are all validated. This flag informs the logic...

        var proceed = false; // flag on if we should move on

        this.abstractStepMoveAllowedToPromise(movingBack).then(function () {
          var valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          // validation was a success (promise or sync validation). In it was a Promise's resolve()
          // ... then proceed will be undefined, so make it true. Or else 'proceed' will carry the true/false value from sync
          proceed = valid;

          if (!movingBack) {
            _this3.updateStepValidationFlag(proceed);
          }

          if (proceed) {
            if (!movingBack) {
              // looks like we are moving forward, 'reduce' a new array of step>validated values we need to check and
              // ... 'some' that to get a decision on if we should allow moving forward
              passThroughStepsNotValid = _this3.props.steps.reduce(function (a, c, i) {
                if (i >= _this3.state.compState && i < targetValue) {
                  a.push(c.validated);
                }

                return a;
              }, []).some(function (c) {
                return c === false;
              });
            }
          }
        })["catch"](function () {
          // Promise based validation was a fail (i.e reject())
          if (!movingBack) {
            _this3.updateStepValidationFlag(false);
          }
        }).then(function () {
          // this is like finally(), executes if error no no error
          if (proceed && !passThroughStepsNotValid) {
            if (targetValue === _this3.props.steps.length - 1 && _this3.state.compState === _this3.props.steps.length - 1) {
              _this3.setNavState(_this3.props.steps.length);
            } else {
              _this3.setNavState(targetValue);
            }
          }
        })["catch"](function (e) {
          if (e) {
            // see note below called "CatchRethrowing"
            // ... plus the finally then() above is what throws the JS Error so we need to catch that here specifically
            setTimeout(function () {
              throw e;
            });
          }
        });
      }
    } // move next via next button

  }, {
    key: "next",
    value: function next() {
      var _this4 = this;

      this.abstractStepMoveAllowedToPromise().then(function () {
        var proceed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        // validation was a success (promise or sync validation). In it was a Promise's resolve() then proceed will be undefined,
        // ... so make it true. Or else 'proceed' will carry the true/false value from sync validation
        _this4.updateStepValidationFlag(proceed);

        if (proceed) {
          _this4.setNavState(_this4.state.compState + 1);
        }
      })["catch"](function (e) {
        if (e) {
          // CatchRethrowing: as we wrap StepMoveAllowed() to resolve as a Promise, the then() is invoked and the next React Component is loaded.
          // ... during the render, if there are JS errors thrown (e.g. ReferenceError) it gets swallowed by the Promise library and comes in here (catch)
          // ... so we need to rethrow it outside the execution stack so it behaves like a notmal JS error (i.e. halts and prints to console)
          //
          setTimeout(function () {
            throw e;
          });
        } // Promise based validation was a fail (i.e reject())


        _this4.updateStepValidationFlag(false);
      });
    } // move behind via previous button

  }, {
    key: "previous",
    value: function previous() {
      if (this.state.compState > 0) {
        this.setNavState(this.state.compState - 1);
      }
    } // update step's validation flag

  }, {
    key: "updateStepValidationFlag",
    value: function updateStepValidationFlag() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.props.steps[this.state.compState].validated = val; // note: if a step component returns 'undefined' then treat as "true".
    } // are we allowed to move forward? via the next button or via jumpToStep?

  }, {
    key: "stepMoveAllowed",
    value: function stepMoveAllowed() {
      var skipValidationExecution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var proceed = false;

      if (this.props.dontValidate) {
        proceed = true;
      } else {
        if (skipValidationExecution) {
          // we are moving backwards in steps, in this case dont validate as it means the user is not commiting to "save"
          proceed = true;
        } else if (this.isStepAtIndexHOCValidationBased(this.state.compState)) {
          // the user is using a higer order component (HOC) for validation (e.g react-validation-mixin), this wraps the StepZilla steps as a HOC,
          // so use hocValidationAppliedTo to determine if this step needs the aync validation as per react-validation-mixin interface
          proceed = this.refs.activeComponent.refs.component.isValidated();
        } else if (Object.keys(this.refs).length === 0 || typeof this.refs.activeComponent.isValidated === 'undefined') {
          // if its a form component, it should have implemeted a public isValidated class (also pure componenets wont even have refs - i.e. a empty object). If not then continue
          proceed = true;
        } else {
          // user is moving forward in steps, invoke validation as its available
          proceed = this.refs.activeComponent.isValidated();
        }
      }

      return proceed;
    }
  }, {
    key: "isStepAtIndexHOCValidationBased",
    value: function isStepAtIndexHOCValidationBased(stepIndex) {
      return this.props.hocValidationAppliedTo.length > 0 && this.props.hocValidationAppliedTo.indexOf(stepIndex) > -1;
    } // a validation method is each step can be sync or async (Promise based), this utility abstracts the wrapper stepMoveAllowed to be Promise driven regardless of validation return type

  }, {
    key: "abstractStepMoveAllowedToPromise",
    value: function abstractStepMoveAllowedToPromise(movingBack) {
      return _promise["default"].resolve(this.stepMoveAllowed(movingBack));
    } // get the classmame of steps

  }, {
    key: "getClassName",
    value: function getClassName(className, i, additionalClassName) {
      var liClassName = "".concat(className, "-").concat(this.state.navState.styles[i]); // if step ui based navigation is disabled, then dont highlight step

      if (!this.props.stepsNavigation) {
        liClassName += ' no-hl';
      }

      if (additionalClassName !== undefined && additionalClassName !== null) {
        liClassName += " ".concat(additionalClassName);
      }

      return liClassName;
    } // render the steps as stepsNavigation

  }, {
    key: "renderSteps",
    value: function renderSteps() {
      var _this5 = this;

      return this.props.steps.map(function (s, i) {
        return _react["default"].createElement("li", {
          className: _this5.getClassName('progtrckr', i, _this5.props.steps[i].additionalClassName),
          onClick: function onClick(evt) {
            _this5.jumpToStep(evt);
          },
          key: i,
          value: i
        }, _react["default"].createElement("em", null, i + 1), _react["default"].createElement("a", null, _this5.props.steps[i].name));
      });
    } // main render of stepzilla container

  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var props = this.props;

      var _this$getPrevNextBtnL = this.getPrevNextBtnLayout(this.state.compState),
          nextStepText = _this$getPrevNextBtnL.nextStepText,
          showNextBtn = _this$getPrevNextBtnL.showNextBtn,
          showPreviousBtn = _this$getPrevNextBtnL.showPreviousBtn; // clone the step component dynamically and tag it as activeComponent so we can validate it on next. also bind the jumpToStep piping method


      var cloneExtensions = {
        jumpToStep: function jumpToStep(t) {
          _this6.jumpToStep(t);
        }
      };
      var componentPointer = this.props.steps[this.state.compState].component; // can only update refs if its a regular React component (not a pure component), so lets check that

      if (componentPointer instanceof _react.Component || componentPointer.type && componentPointer.type.prototype instanceof _react.Component) {
        // unit test deteceted that instanceof Component can be in either of these locations so test both (not sure why this is the case)
        cloneExtensions.ref = 'activeComponent';
      }

      var compToRender = _react["default"].cloneElement(componentPointer, cloneExtensions);

      return _react["default"].createElement("div", {
        className: "multi-step",
        onKeyDown: function onKeyDown(evt) {
          _this6.handleKeyDown(evt);
        }
      }, this.props.showSteps ? _react["default"].createElement("ol", {
        className: "progtrckr"
      }, this.renderSteps()) : _react["default"].createElement("span", null), compToRender, _react["default"].createElement("div", {
        style: this.props.showNavigation ? {} : this.hidden,
        className: "footer-buttons"
      }, _react["default"].createElement("button", {
        type: "button",
        style: showPreviousBtn ? {} : this.hidden,
        className: props.backButtonCls,
        onClick: function onClick() {
          _this6.previous();
        },
        id: "prev-button"
      }, this.props.backButtonChildren, this.props.backButtonText), _react["default"].createElement("button", {
        type: "button",
        style: showNextBtn ? {} : this.hidden,
        className: props.nextButtonCls,
        onClick: function onClick() {
          _this6.next();
        },
        id: "next-button"
      }, this.props.nextButtonChildren, nextStepText)));
    }
  }]);
  return StepZilla;
}(_react.Component);

exports["default"] = StepZilla;
StepZilla.defaultProps = {
  showSteps: true,
  showNavigation: true,
  stepsNavigation: true,
  prevBtnOnLastStep: true,
  dontValidate: false,
  dontAllowStepMoves: false,
  preventEnterSubmission: false,
  startAtStep: 0,
  currentStep: 0,
  nextButtonText: 'Next',
  nextButtonCls: 'btn btn-prev btn-primary btn-lg pull-right',
  backButtonText: 'Previous',
  backButtonCls: 'btn btn-next btn-primary btn-lg pull-left',
  hocValidationAppliedTo: []
};
StepZilla.propTypes = {
  steps: _propTypes["default"].arrayOf(_propTypes["default"].shape({
    name: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]).isRequired,
    component: _propTypes["default"].element.isRequired,
    additionalClassName: _propTypes["default"].string
  })).isRequired,
  showSteps: _propTypes["default"].bool,
  showNavigation: _propTypes["default"].bool,
  stepsNavigation: _propTypes["default"].bool,
  prevBtnOnLastStep: _propTypes["default"].bool,
  dontValidate: _propTypes["default"].bool,
  dontAllowStepMoves: _propTypes["default"].bool,
  preventEnterSubmission: _propTypes["default"].bool,
  startAtStep: _propTypes["default"].number,
  currentStep: _propTypes["default"].number,
  nextButtonChildren: _propTypes["default"].object,
  nextButtonCls: _propTypes["default"].string,
  nextButtonText: _propTypes["default"].string,
  backButtonChildren: _propTypes["default"].object,
  backButtonCls: _propTypes["default"].string,
  backButtonText: _propTypes["default"].string,
  hocValidationAppliedTo: _propTypes["default"].array,
  onBeforeStepChange: _propTypes["default"].func,
  onStepChange: _propTypes["default"].func
};