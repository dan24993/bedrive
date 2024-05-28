import {To} from 'react-router-dom';
import {AppearanceValues} from '../appearance-store';
import {FontConfig} from '@common/http/value-lists';

export interface AppearanceCommand {
  source: 'be-appearance-editor';
  type: string;
}

export interface Navigate {
  type: 'navigate';
  to: To;
}

export interface SetAppearanceValues {
  type: 'setValues';
  values: AppearanceValues;
}

export interface SetThemeValue {
  type: 'setThemeValue';
  name: string;
  value: string;
}

export interface SetActiveTheme {
  type: 'setActiveTheme';
  themeId: number | string;
}

export interface SetCustomCode {
  type: 'setCustomCode';
  mode: 'css' | 'html';
  value?: string;
}

export interface SetThemeFont {
  type: 'setThemeFont';
  value: FontConfig | null;
}

export type AllCommands =
  | Navigate
  | SetAppearanceValues
  | SetThemeValue
  | SetThemeFont
  | SetActiveTheme
  | SetCustomCode;
