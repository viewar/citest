import React from "react";
import { InferProps } from "prop-types";
import styles from "../RoomCapture.scss";
import { RoomCaptureStepPropTypes } from "./RoomCaptureStepPropTypes";
import Button from "components/Primitives/Button";
import ButtonPanel from "components/Patterns/ButtonPanel";
import useTranslation from "hooks/useTranslation";

function RoomCaptureHeight({ roomCapturing, goToNextStep, height, finishCapture }: InferProps<typeof RoomCaptureHeight.propTypes>) {
  const translationService = useTranslation();

  const captureRoomHeight = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    await roomCapturing.capture();
    goToNextStep();
  };

  const skipRoomHeight = async (e) => {
    if (e) {
      e.stopPropagation();
    }

    finishCapture();
  }

  return (
    <>
      {height > 0 && (
        <div className={styles.Measurement}>
          Height: {height} cm
        </div>
      )}

      <ButtonPanel
        buttonsArray={[
          {
            id: "skip",
            icon: "debug-step-over",
            name:(translationService.translate("BUTTON_PANEL_SKIP") as string),
            onClick: skipRoomHeight,
            variant: "filled",
          },
          {
            id: "capture",
            icon: "check",
            name: (translationService.translate("BUTTON_PANEL_COMPLETE") as string),
            onClick: captureRoomHeight,
            variant: "default",
          }
        ]}
        showButtons={true}
      />
    </>
  );
}

RoomCaptureHeight.propTypes = RoomCaptureStepPropTypes;

export default RoomCaptureHeight;
