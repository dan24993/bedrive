import React from 'react';
import {useDialogContext} from './dialog-context';
import {Dialog} from './dialog';
import {DialogBody} from './dialog-body';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CloseIcon} from '@common/icons/material/Close';
import {KeyboardArrowLeftIcon} from '@common/icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '@common/icons/material/KeyboardArrowRight';
import {useControlledState} from '@react-stately/utils';

interface Props {
  image?: string;
  images?: string[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  defaultActiveIndex?: number;
}
export function ImageZoomDialog(props: Props) {
  const {close} = useDialogContext();
  const {image, images} = props;
  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex,
    props.onActiveIndexChange,
  );
  const src = image || images?.[activeIndex];

  return (
    <Dialog size="fullscreenTakeover" background="bg-black/80">
      <DialogBody padding="p-0" className="h-full w-full">
        <IconButton
          size="lg"
          color="paper"
          className="absolute right-0 top-0 z-20 text-white"
          onClick={() => {
            close();
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="relative flex h-full w-full items-center justify-center p-40">
          {images?.length ? (
            <IconButton
              size="lg"
              color="white"
              variant="flat"
              className="absolute bottom-0 left-20 top-0 my-auto"
              disabled={activeIndex < 1}
              onClick={() => {
                setActiveIndex(activeIndex - 1);
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          ) : null}
          <img
            src={src}
            alt=""
            className="max-h-full w-auto object-contain shadow"
          />
          {images?.length ? (
            <IconButton
              size="lg"
              color="white"
              variant="flat"
              className="absolute bottom-0 right-20 top-0 my-auto"
              disabled={activeIndex + 1 === images?.length}
              onClick={() => {
                setActiveIndex(activeIndex + 1);
              }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          ) : null}
        </div>
      </DialogBody>
    </Dialog>
  );
}
