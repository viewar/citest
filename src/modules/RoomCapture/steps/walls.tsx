import React from "react";
import { InferProps } from "prop-types";
import styles from "../RoomCapture.scss";
import { RoomCaptureStepPropTypes } from "./RoomCaptureStepPropTypes";
import Button from "components/Primitives/Button";
import cx from "classnames";
import Icon from "components/Primitives/Icon";
import ButtonPanel from "components/Patterns/ButtonPanel";
import useTranslation from "hooks/useTranslation";

function RoomCaptureWalls({ roomCapturing, canUndo, canCapture, snapped, length }: InferProps<typeof RoomCaptureWalls.propTypes>) {
  const translationService = useTranslation();

  const undoCapture = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    await roomCapturing.undo();
  }

  const capture = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    await roomCapturing.capture();
  }

  return (
    <>
      {length > 0 && (
        <div className={styles.Measurement}>
          Length: {length} cm
        </div>
      )}

      <ButtonPanel
        buttonsArray={[
          ...(canUndo ? [
            {
              id: "undo",
              icon: "cancel",
              name: (translationService.translate("BUTTON_PANEL_UNDO") as string),
              onClick: undoCapture, variant: "filled",
            }
          ] : []),
          {
            id: "capture",
            icon: "check",
            name: snapped ?
              (translationService.translate("BUTTON_PANEL_COMPLETE") as string) :
              (translationService.translate("BUTTON_PANEL_CAPTURE_CORNER") as string),
            onClick: capture, disabled: !canCapture, variant: "default",
          }
        ]}
        showButtons={true}
      />
    </>
  );
}

RoomCaptureWalls.propTypes = RoomCaptureStepPropTypes;

export default RoomCaptureWalls;
