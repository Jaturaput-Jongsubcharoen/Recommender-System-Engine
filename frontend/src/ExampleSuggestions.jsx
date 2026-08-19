import React from 'react'

export default function ExampleSuggestions({ examples, onSelect, label = 'Try an example', description, formatExample = value => value }) {
  if (!examples.length) return null
  return <div className="example-suggestions" role="group" aria-label={description || label}>
    <span>{label}</span>
    <div>{examples.map(example => { const display = formatExample(example); return <button type="button" key={example} onClick={() => onSelect(example)} title={`Use example: ${display}`} aria-label={`Use example: ${display}`}>{display}</button> })}</div>
  </div>
}
