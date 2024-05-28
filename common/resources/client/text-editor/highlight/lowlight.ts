import {createLowlight} from 'lowlight';

// load specific languages only
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import php from 'highlight.js/lib/languages/php';
import shell from 'highlight.js/lib/languages/shell';
import bash from 'highlight.js/lib/languages/bash';
import ruby from 'highlight.js/lib/languages/ruby';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import c from 'highlight.js/lib/languages/c';

// load css
import './highlight-material-palenight.css';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('php', php);
lowlight.register('shell', shell);
lowlight.register('bash', bash);
lowlight.register('ruby', ruby);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('c', c);

export {lowlight};
