import {CSSProperties} from 'react';
import {
  BaseGradientBg,
  GradientBackgrounds,
} from '@common/background-selector/gradient-backgrounds';
import {
  BaseImageBg,
  ImageBackgrounds,
} from '@common/background-selector/image-backgrounds';
import {
  BackgroundSelectorConfig,
  EditableBackgroundProps,
} from '@common/background-selector/background-selector-config';
import {
  BaseColorBg,
  ColorBackgrounds,
} from '@common/background-selector/color-backgrounds';

export function bgConfigFromCssProps(
  cssProps: CSSProperties | CSSStyleDeclaration,
): BackgroundSelectorConfig | undefined {
  if (cssProps.backgroundImage?.includes('-gradient(')) {
    return gradientConfigFromCssProps(cssProps);
  } else if (cssProps.backgroundImage?.includes('url(')) {
    return imageConfigFromCssProps(cssProps);
  } else if (
    cssProps.backgroundColor &&
    cssProps.backgroundColor !== 'rgba(0, 0, 0, 0)'
  ) {
    return solidColorConfigFromCssProps(cssProps);
  }
}

function gradientConfigFromCssProps(
  cssProps: CSSProperties | CSSStyleDeclaration,
): BackgroundSelectorConfig {
  const preset =
    GradientBackgrounds.find(g =>
      compareCssStrings(g.backgroundImage, cssProps.backgroundImage),
    ) ?? BaseGradientBg;
  return {
    ...preset,
    backgroundImage: cssProps.backgroundImage,
    backgroundColor: cssProps.backgroundColor,
    color: cssProps.color,
  };
}

function imageConfigFromCssProps(
  cssProps: CSSProperties | CSSStyleDeclaration,
): BackgroundSelectorConfig {
  const preset =
    ImageBackgrounds.find(b =>
      compareCssStrings(b.backgroundImage, cssProps.backgroundImage),
    ) ?? BaseImageBg;
  return {
    ...preset,
    backgroundImage: cssProps.backgroundImage,
    backgroundColor: cssProps.backgroundColor,
    backgroundAttachment:
      cssProps.backgroundAttachment as EditableBackgroundProps['backgroundAttachment'],
    color: cssProps.color,
  };
}

function solidColorConfigFromCssProps(
  cssProps: CSSProperties | CSSStyleDeclaration,
): BackgroundSelectorConfig {
  const preset =
    ColorBackgrounds.find(b =>
      compareCssStrings(b.backgroundColor, cssProps.backgroundColor),
    ) ?? BaseColorBg;
  return {
    ...preset,
    color: cssProps.color,
    backgroundColor: cssProps.backgroundColor,
  };
}

function compareCssStrings(a: string | undefined, b: string | undefined) {
  if (!a || !b) {
    return false;
  }
  return normalizeCssValue(a) === normalizeCssValue(b);
}

function normalizeCssValue(value: string) {
  return value.replaceAll(' ', '').replaceAll('"', '').replaceAll("'", '');
}

export function urlFromBackgroundImage(
  backgroundImage: string | undefined,
): string | undefined {
  if (backgroundImage) {
    const match = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    return match?.[1];
  }
}
