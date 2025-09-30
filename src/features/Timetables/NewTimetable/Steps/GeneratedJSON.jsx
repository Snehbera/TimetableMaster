import React, { useState, useMemo } from "react";
import useTimetableStore from "../../../../Stores/TimetableStore"; // Adjust this import path as needed
import generateJsonForBackend from "../../../../utils/TimetableTransformer"; // Adjust this import path as needed

// --- Icon Components ---
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
);


const GeneratedJsonDisplay = () => {
  // 1. Get the entire state from the store.
  // The component will automatically re-render when any part of the state changes.
  const fullState = useTimetableStore((state) => state);
  const [copyStatus, setCopyStatus] = useState("Copy");

  // 2. Memoize the JSON generation.
  // This ensures the potentially complex transformation only runs when the state actually changes.
  const jsonString = useMemo(() => {
    try {
      const generatedJson = generateJsonForBackend(fullState);
      // The `null, 2` arguments pretty-print the JSON with an indentation of 2 spaces.
      return JSON.stringify(generatedJson, null, 2);
    } catch (error) {
      console.error("Error generating JSON:", error);
      return "{\n  \"error\": \"Could not generate JSON. Check console for details.\"\n}";
    }
  }, [fullState]);

  // 3. Handle the copy-to-clipboard functionality.
  const handleCopy = () => {
    // A temporary textarea is used for better compatibility.
    const textArea = document.createElement("textarea");
    textArea.value = jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy"), 2000); // Reset after 2 seconds
    } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyStatus("Failed");
        setTimeout(() => setCopyStatus("Copy"), 2000);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <CodeIcon />
            Live JSON Output for Backend
        </h2>
      <div className="relative bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-200 max-h-96 overflow-auto">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold py-1 px-3 rounded-md flex items-center transition-colors z-10"
        >
          {copyStatus === "Copy" ? <ClipboardIcon /> : <CheckIcon />}
          {copyStatus}
        </button>
        <pre>
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};

export default GeneratedJsonDisplay;

