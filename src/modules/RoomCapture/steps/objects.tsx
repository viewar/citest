import React, { useEffect, useState } from "react";
import { InferProps } from "prop-types";
import styles from "../RoomCapture.scss";
import { RoomCaptureStepPropTypes } from "./RoomCaptureStepPropTypes";
import Button from "components/Primitives/Button";
import cx from "classnames";
import ButtonPanel from "components/Patterns/ButtonPanel";
import useTranslation from "hooks/useTranslation";

function RoomCaptureObjects({ roomCapturing, finishCapture, canCapture, canFinish, objectCaptureType, setObjectCaptureType, objectSecondStep, setObjectSecondStep }: InferProps<typeof RoomCaptureObjects.propTypes>) {
  const translationService = useTranslation();

  const captureObject = async (e) => {
     if (e) {
      e.stopPropagation();
    }

    const { captured, finished } = await roomCapturing.capture(objectCaptureType);

    if (captured) {
      setObjectSecondStep(true);
    }

    if (finished) {
      setObjectCaptureType(false);
    }
  };

  const undoObject = (e) => {
     if (e) {
      e.stopPropagation();
    }

    if (objectSecondStep) {
      setObjectSecondStep(false);
    }
    roomCapturing.undo();
  };

  const captureType = (e, type) => {
     if (e) {
      e.stopPropagation();
    }

    setObjectCaptureType(type);
    setObjectSecondStep(false);
  };

  const cancel = (e) => {
     if (e) {
      e.stopPropagation();
    }

    setObjectCaptureType(false);
  };

  const finishCapturing = async (e, val) => {
     if (e) {
      e.stopPropagation();
    }

    await finishCapture(true);
  }

  return (
    <>
      {!!objectCaptureType && (
        <>
          <div className={styles.CrossHairWrapper}>
            <div
              className={cx(
                styles.CrossHair,
                styles[`type-${objectCaptureType}`],
                objectSecondStep && styles["second-step"]
              )}
            />
          </div>
        </>
      )}

      <ButtonPanel
        buttonsArray={!objectCaptureType ? [
          {
            id: "addDoor",
            icon: "object-door",
            name: (translationService.translate("BUTTON_PANEL_ADD_DOOR") as string),
            onClick: (e) => captureType(e, "door"),
            variant: "filled",
          },
          {
            id: "addWindow",
            icon: "object-window",
            name: (translationService.translate("BUTTON_PANEL_ADD_WINDOW") as string),
            onClick: (e) => captureType(e, "window"),
            variant: "filled",
          },
          {
            id: "finish",
            icon: "check",
            name: (translationService.translate("BUTTON_PANEL_COMPLETE") as string),
            onClick: (e) => finishCapturing(e, true),
            variant: "default",
          },
        ] : [
          ...(objectSecondStep ? [
            {
              id: "undo",
              icon: "cancel",
              name: (translationService.translate("BUTTON_PANEL_UNDO") as string),
              onClick: undoObject,
              variant: "filled",
            }
          ] : []),
          {
            id: "cancel",
            icon: "cancel",
            name: (translationService.translate("BUTTON_PANEL_CANCEL") as string),
            onClick: cancel,
            variant: "filled",
          },
          {
            disabled: !canCapture,
            icon: "check",
            id: "capture",
            name: (translationService.translate("BUTTON_PANEL_CAPTURE_CORNER") as string),
            onClick: captureObject,
            variant: "default",
          },
        ]}
        showButtons={true}
      />
    </>
  );
}

RoomCaptureObjects.propTypes = RoomCaptureStepPropTypes;

export default RoomCaptureObjects;
