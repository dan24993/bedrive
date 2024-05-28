import ace from 'ace-builds/src-noconflict/ace';
import cssWorkerUrl from 'ace-builds/src-noconflict/worker-css?url';
import htmlWorkerUrl from 'ace-builds/src-noconflict/worker-html?url';
import phpWorkerUrl from 'ace-builds/src-noconflict/worker-php?url';
import javascriptWorkerUrl from 'ace-builds/src-noconflict/worker-javascript?url';
import React, {MutableRefObject, useEffect, useRef} from 'react';
import AceEditorRender from 'react-ace';
import ReactAce from 'react-ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-php_laravel_blade';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import {useIsDarkMode} from '../ui/themes/use-is-dark-mode';

ace.config.setModuleUrl('ace/mode/css_worker', cssWorkerUrl);
ace.config.setModuleUrl('ace/mode/html_worker', htmlWorkerUrl);
ace.config.setModuleUrl('ace/mode/php_worker', phpWorkerUrl);
ace.config.setModuleUrl('ace/mode/javascript_worker', javascriptWorkerUrl);

interface Props {
  mode: 'css' | 'html' | 'javascript' | 'php_laravel_blade';
  onChange: (value: string) => void;
  onIsValidChange: (isValid: boolean) => void;
  defaultValue: string;
  beautify?: boolean;
  editorRef?: MutableRefObject<ReactAce | null>;
}
export default function AceEditor({
  mode,
  onChange,
  onIsValidChange,
  defaultValue,
  beautify = true,
  editorRef: propsEditorRef,
}: Props) {
  const isDarkMode = useIsDarkMode();
  const defaultRef = useRef<ReactAce | null>(null);
  const editorRef = propsEditorRef || defaultRef;

  useEffect(() => {
    if (beautify && editorRef.current) {
      Beautify.beautify(editorRef.current.editor.session);
    }
  }, [beautify, editorRef]);

  return (
    <AceEditorRender
      ref={editorRef}
      width="auto"
      height="auto"
      wrapEnabled
      className="absolute inset-0"
      focus
      mode={mode}
      theme={isDarkMode ? 'tomorrow_night' : 'chrome'}
      enableBasicAutocompletion
      enableLiveAutocompletion
      defaultValue={defaultValue}
      onChange={onChange}
      editorProps={{$blockScrolling: true}}
      commands={Beautify.commands}
      onValidate={annotations => {
        const isValid =
          annotations.filter(a => a.type === 'error').length === 0;
        onIsValidChange(isValid);
      }}
    />
  );
}
