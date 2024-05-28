import angledFocus from './svg-bgs/Angled-Focus.svg';
import circularFocus from './svg-bgs/Circular-Focus.svg';
import farseeingEyeball from './svg-bgs/Farseeing-Eyeball.svg';
import canyonFunnel from './svg-bgs/Canyon-Funnel.svg';
import looneyLoops from './svg-bgs/Looney-Loops.svg';
import hurricaneAperture from './svg-bgs/Hurricane-Aperture.svg';
import icyExplosion from './svg-bgs/Icy-Explosion.svg';
import protrudingSquares from './svg-bgs/Protruding-Squares.svg';
import alternatingTriangles from './svg-bgs/Alternating-Triangles.svg';
import monsteraPatch from './svg-bgs/Monstera-Patch.svg';
import confettiDoodles from './svg-bgs/Confetti-Doodles.svg';
import threadsAhead from './svg-bgs/Threads-Ahead.svg';
import launchDay from './svg-bgs/Launch-Day.svg';
import sprinkle from './svg-bgs/Sprinkle.svg';
import circuitBoard from './svg-bgs/Circuit-Board.svg';
import nuclearFocalPoint from './svg-bgs/nuclear-focalpoint.svg';
import snow from './svg-bgs/Snow.svg';
import {message} from '@common/i18n/message';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

export const BaseImageBg: BackgroundSelectorConfig = {
  type: 'image',
  id: 'i-custom',
  label: message('Custom image'),
};

export const ImageBackgrounds: BackgroundSelectorConfig[] = [
  {
    ...BaseImageBg,
    id: 'img0',
    backgroundColor: '#ee5522',
    backgroundImage: `url(${protrudingSquares})`,
    backgroundRepeat: 'repeat',
    label: message('Protruding squares'),
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img1',
    backgroundColor: '#00bbff',
    backgroundImage: `url(${launchDay})`,
    label: message('Launch day'),
    backgroundSize: 'contain',
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img2',
    backgroundColor: '#fff',
    backgroundImage: `url(${alternatingTriangles})`,
    label: message('Alternating triangles'),
    color: '#000',
  },
  {
    ...BaseImageBg,
    id: 'img3',
    backgroundColor: '#002200',
    backgroundImage: `url(${monsteraPatch})`,
    label: message('Monstera patch'),
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img4',
    backgroundColor: '#aa3333',
    backgroundImage: `url(${confettiDoodles})`,
    label: message('Confetti doodles'),
    color: '#fff',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
  },
  {
    ...BaseImageBg,
    id: 'img5',
    backgroundColor: '#070014',
    backgroundImage: `url(${hurricaneAperture})`,
    label: message('Hurricane aperture'),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img6',
    backgroundColor: '#11ddaa',
    backgroundImage: `url(${looneyLoops})`,
    label: message('Looney loops'),
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    color: '#000',
  },
  {
    ...BaseImageBg,
    id: 'img7',
    backgroundColor: '#ccffff',
    backgroundImage: `url(${icyExplosion})`,
    label: message('Icy explosion'),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    color: '#000',
  },
  {
    ...BaseImageBg,
    id: 'img8',
    backgroundColor: '#442233',
    backgroundImage: `url(${nuclearFocalPoint})`,
    label: message('Nuclear point'),
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img9',
    backgroundColor: '#ffdd55',
    backgroundImage: `url(${angledFocus})`,
    label: message('Angled focus'),
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img10',
    backgroundColor: '#220044',
    backgroundImage: `url(${circularFocus})`,
    label: message('Circular focus'),
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img11',
    backgroundColor: '#000000',
    backgroundImage: `url(${farseeingEyeball})`,
    label: message('Farseeing eyeball'),
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img12',
    backgroundColor: '#ff0000',
    backgroundImage: `url(${canyonFunnel})`,
    label: message('Canyon funnel'),
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    color: '#fff',
  },
  {
    ...BaseImageBg,
    id: 'img13',
    backgroundColor: '#ffdd99',
    backgroundImage: `url(${threadsAhead})`,
    label: message('Threads ahead'),
    color: '#000',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
  },
  {
    ...BaseImageBg,
    id: 'img14',
    backgroundImage: `url(${sprinkle})`,
    label: message('Sprinkle'),
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
  },
  {
    ...BaseImageBg,
    id: 'img15',
    backgroundImage: `url(${circuitBoard})`,
    label: message('Circuit board'),
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
  },
  {
    ...BaseImageBg,
    id: 'img16',
    backgroundImage: `url(${snow})`,
    label: message('Snow'),
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
  },
];
