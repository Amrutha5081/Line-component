import React, { useState, useRef } from 'react';
import './Line.css'; // Import the CSS file

const Line = () => {
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [isFocused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState(['Amrutha', 'Amala', 'John', 'Jane']); // Dummy suggestions
  const [chips, setChips] = useState([]); // State for chips
  const lineRef = useRef(null);

  const handleLineClick = () => {
    setFocused(true);
  };

 
  const handleTyping = () => {
    const currentText = (lineRef.current?.textContent || '').trim().toLowerCase(); // Use textContent for cursor preservation
    setText(currentText);
  
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().startsWith(currentText)
    );
  setSuggestions(filteredSuggestions);

  // Move the cursor to the end of the contentEditable element
  const lineElement = lineRef.current;
  if (lineElement) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(lineElement);
    range.collapse(false); // Collapse to the end
    selection.removeAllRanges();
    selection.addRange(range);
  }
};


const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && isFocused && suggestions.length > 0) {
        setFocusedSuggestionIndex((prevIndex) =>
            Math.min(prevIndex + 1, suggestions.length - 1)
        );
    } else if (e.key === 'ArrowUp' && isFocused && suggestions.length > 0) {
        setFocusedSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (e.key === 'Enter' && isFocused && suggestions.length > 0 && focusedSuggestionIndex >= 0) {
        const selectedSuggestion = suggestions[focusedSuggestionIndex];
        handleSuggestionClick(selectedSuggestion);
    }
    
};
  const handleBlur = () => {
    setFocused(false);
  };
  
  const handleSuggestionClick = (suggestion) => {
    const newText = `${text} ${suggestion}`.trim();
    const newChips = [...chips, suggestion];
  
    setText(newText);
    setSuggestions(suggestions.filter((s) => s !== suggestion));
    setChips(newChips);
  };
  
  const handleChipClose = (chip) => {
    const newChips = chips.filter((c) => c !== chip);
  
    // No need to append text here, it's already handled in handleSuggestionClick
    setChips(newChips);
  
    // Add the removed chip back to suggestions
    setSuggestions([...suggestions, chip]);
  };
  
  return (
    <div className="line-container" onClick={handleLineClick} onBlur={handleBlur} tabIndex="0">
      <div
    className={`line ${isFocused ? 'focused' : ''}`}
    contentEditable={isFocused}
    onInput={handleTyping}
    onKeyDown={handleKeyDown}
    ref={lineRef}
  >
    {/* Chips are now rendered only here */}
    {chips.map((chip, index) => (
      <span key={index} className="chip">
        {chip} <button onClick={() => handleChipClose(chip)}>x</button>
      </span>
    ))}
   
  </div>
      {isFocused && (
        <ul className="suggestions-dropdown">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li key={index} className={index === focusedSuggestionIndex ? 'focused' : ''} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))
          ) : (
            <li key="no-suggestions">No suggestions</li>
          )}
        </ul>
      )}
    </div>
  );
  };

export default Line;
