import {message} from '@common/i18n/message';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

export const BaseGradientBg: BackgroundSelectorConfig = {
  type: 'gradient',
  id: 'g-custom',
  label: message('Custom gradient'),
};

export const GradientBackgrounds: BackgroundSelectorConfig[] = [
  {
    ...BaseGradientBg,
    id: 'g1',
    backgroundImage: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
    label: message('Worm flame'),
  },
  {
    ...BaseGradientBg,
    id: 'g2',
    backgroundImage: 'linear-gradient(0deg, #a18cd1, #fbc2eb)',
    label: message('Night fade'),
  },
  {
    ...BaseGradientBg,
    id: 'g3',
    backgroundImage: 'linear-gradient(120deg, #a1c4fd, #c2e9fb)',
    label: message('Winter nova'),
  },
  {
    ...BaseGradientBg,
    id: 'g4',
    backgroundImage: 'linear-gradient(0deg, #cfd9df, #e2ebf0)',
    label: message('Heavy rain'),
  },
  {
    ...BaseGradientBg,
    id: 'g5',
    backgroundImage: 'linear-gradient(120deg, #fdfbfb, #ebedee)',
    label: message('Cloudy knoxville'),
  },
  {
    ...BaseGradientBg,
    id: 'g6',
    backgroundImage: 'linear-gradient(0deg, #a8edea, #fed6e3)',
    label: message('Rare wind'),
  },
  {
    ...BaseGradientBg,
    id: 'g7',
    backgroundImage: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    label: message('Saint petersburg'),
  },
  {
    ...BaseGradientBg,
    id: 'g8',
    backgroundImage: 'linear-gradient(135deg, #fdfcfb, #e2d1c3)',
    label: message('Everlasting sky'),
  },
  {
    ...BaseGradientBg,
    id: 'g9',
    backgroundImage: 'linear-gradient(0deg, #c1dfc4, #deecdd)',
    label: message('Soft grass'),
  },
  {
    ...BaseGradientBg,
    id: 'g10',
    backgroundImage: 'linear-gradient(90deg, #E9E4F0, #D3CCE3)',
    label: message('Delicate'),
  },
  {
    ...BaseGradientBg,
    id: 'g11',
    backgroundImage: 'linear-gradient(90deg, #fffcdc, #d9a7c7)',
    label: message('Broken hearts'),
  },
  {
    ...BaseGradientBg,
    id: 'g12',
    backgroundImage: 'linear-gradient(90deg, #56ab2f, #a8e063)',
    label: message('Lush'),
    color: 'rgb(255, 255, 255)',
  },
  {
    ...BaseGradientBg,
    id: 'g13',
    backgroundImage: 'linear-gradient(90deg, #606c88, #3f4c6b)',
    label: message('Ash'),
    color: 'rgb(255, 255, 255)',
  },
  {
    ...BaseGradientBg,
    id: 'g14',
    backgroundImage: 'linear-gradient(90deg, #ece9e6, #ffffff)',
    label: message('Clouds'),
  },
  {
    ...BaseGradientBg,
    id: 'g15',
    backgroundImage: 'linear-gradient(90deg, #f09819, #edde5d)',
    label: message('Mango pulp'),
  },
  {
    ...BaseGradientBg,
    id: 'g16',
    backgroundImage: 'linear-gradient(90deg, #b79891, #94716b)',
    label: message('Cooper'),
    color: 'rgb(255, 255, 255)',
  },
  {
    ...BaseGradientBg,
    id: 'g17',
    backgroundImage: 'linear-gradient(60deg, #29323c, #485563)',
    label: message('Vicious stance'),
    color: 'rgb(255, 255, 255)',
  },
];
