import PropTypes from "prop-types";

export const RoomCaptureStepPropTypes = {
  roomCapturing: PropTypes.any,
  finishCapture: PropTypes.func,
  goToNextStep: PropTypes.func,
  canUndo: PropTypes.bool,
  canFinish: PropTypes.bool,
  canCapture: PropTypes.bool,
  length: PropTypes.number,
  height: PropTypes.number,
  snapped: PropTypes.bool,
  objectSecondStep: PropTypes.bool,
  setObjectSecondStep: PropTypes.func,
  objectCaptureType: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  setObjectCaptureType: PropTypes.func,
};

export default RoomCaptureStepPropTypes;
