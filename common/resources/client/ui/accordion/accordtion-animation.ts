export const AccordionAnimation = {
  variants: {
    open: {
      height: 'auto',
      visibility: 'visible',
      transitionEnd: {
        overflow: 'auto',
      },
    },
    closed: {
      height: 0,
      overflow: 'hidden',
      transitionEnd: {
        visibility: 'hidden',
      },
    },
  },
  transition: {type: 'tween', duration: 0.2},
} as const;
