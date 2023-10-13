import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai'; // You can choose a different theme


const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const codeLanguages = {
    java: 'java',
    javascript: 'javascript',
    python: 'python',
    cpp: 'c_cpp',
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <div className="flex space-x-4">
          <button
            className={`${
              selectedLanguage === 'java' ? 'bg-blue-600' : 'bg-blue-400'
            } hover:bg-blue-600 rounded-md p-2`}
            onClick={() => handleLanguageChange('java')}
          >
            Java
          </button>
          <button
            className={`${
              selectedLanguage === 'javascript' ? 'bg-blue-600' : 'bg-blue-400'
            } hover:bg-blue-600 rounded-md p-2`}
            onClick={() => handleLanguageChange('javascript')}
          >
            JavaScript
          </button>
          <button
            className={`${
              selectedLanguage === 'python' ? 'bg-blue-600' : 'bg-blue-400'
            } hover:bg-blue-600 rounded-md p-2`}
            onClick={() => handleLanguageChange('python')}
          >
            Python
          </button>
          <button
            className={`${
              selectedLanguage === 'cpp' ? 'bg-blue-600' : 'bg-blue-400'
            } hover:bg-blue-600 rounded-md p-2`}
            onClick={() => handleLanguageChange('cpp')}
          >
            C++
          </button>
        </div>
      </div>
      <AceEditor
        mode={codeLanguages[selectedLanguage]}
        theme="monokai"
        name="code-editor"
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        height="calc(100% - 60px)" // Adjust the height based on your layout
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
