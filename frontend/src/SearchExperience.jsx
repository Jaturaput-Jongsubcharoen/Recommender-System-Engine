import React, { useEffect, useRef, useState } from 'react'
import { api } from './api'
import ExampleSuggestions from './ExampleSuggestions'

const STORAGE_KEY = 'recommender-search-preferences-v1'
const emptyPreferences = { favorite_terms: [], liked_titles: [], disliked_titles: [], recent_searches: [] }
const searchExamples = [
  'uplifting acoustic worship music',
  'relaxing piano music for studying',
  'energetic rock music with guitar',
]
const preferenceExamples = [
  'gospel, acoustic, piano',
  'worship, live, vocals',
  'rock, guitar, energetic',
]

function storedPreferences() {
  try { return { ...emptyPreferences, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } }
  catch { return emptyPreferences }
}

function ScoreDetails({ result }) {
  return <details className="search-score-details"><summary>Why this ranked here</summary><div className="score-grid">
    <span>Lexical <b>{Math.round(result.scores.lexical_score * 100)}%</b></span>
    <span>Semantic <b>{Math.round(result.scores.semantic_score * 100)}%</b></span>
    <span>Metadata <b>{Math.round(result.scores.metadata_score * 100)}%</b></span>
    <span>Preference <b>{Math.round(result.scores.personalization_score * 100)}%</b></span>
    <span>Final rank score <b>{result.scores.reranking_score.toFixed(3)}</b></span>
  </div><ul>{result.explanations.map(reason => <li key={reason}>{reason}</li>)}</ul></details>
}

function ResultList({ title, results, onPreference, preferences }) {
  return <section className="search-result-column"><h3>{title}</h3>{results.map(result => {
    const liked = preferences.liked_titles.includes(result.title)
    const disliked = preferences.disliked_titles.includes(result.title)
    return <article className="search-result" key={`${title}-${result.title}`}><span className="search-rank">{String(result.rank).padStart(2, '0')}</span><div className="search-result-body"><h4>{result.title}</h4>{result.brand && <p className="search-brand">{result.brand}</p>}<p>{result.snippet || 'No descriptive summary is available for this catalog item.'}</p><div className="reason-strip">{result.explanations.map(reason => <span key={reason}>{reason}</span>)}</div><ScoreDetails result={result}/><div className="preference-actions"><button className={liked ? 'selected' : ''} onClick={() => onPreference('liked_titles', result.title)}>Like</button><button className={disliked ? 'selected' : ''} onClick={() => onPreference('disliked_titles', result.title)}>Not for me</button></div></div></article>
  })}</section>
}

function SearchArtwork() {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setRevealed(true), { threshold: .25 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return <figure ref={ref} className={`search-art ${revealed ? 'revealed' : ''}`}><svg viewBox="0 0 520 420" role="img"><title>A magnifying glass finding matching music in a catalog</title><rect className="search-art-red" x="322" y="48" width="142" height="142"/><g className="search-field"><rect x="56" y="55" width="342" height="54"/><circle cx="82" cy="82" r="12"/><path d="M91 91l10 10M120 82h196"/><path className="search-cursor" d="M328 70v24"/></g><g className="catalog-notes"><g transform="translate(78 164)"><rect width="104" height="76"/><path d="M44 49V20l30-7v29M44 49c0 8-20 11-20 1s20-13 20-1Zm30-7c0 8-20 11-20 1s20-13 20-1Z"/></g><g transform="translate(199 164)"><rect width="104" height="76"/><path d="M44 49V20l30-7v29M44 49c0 8-20 11-20 1s20-13 20-1Zm30-7c0 8-20 11-20 1s20-13 20-1Z"/></g><g className="matched-track" transform="translate(320 164)"><rect width="104" height="76"/><path d="M44 49V20l30-7v29M44 49c0 8-20 11-20 1s20-13 20-1Zm30-7c0 8-20 11-20 1s20-13 20-1Z"/></g></g><g className="search-lens"><circle cx="275" cy="249" r="88"/><path d="M337 311l81 81"/></g><path className="search-scan" d="M199 249h152"/><path className="search-match-mark" d="M352 147l20 18 38-43"/></svg><figcaption><b>SEARCH THE MUSIC CATALOG</b><span>query → discover matching titles</span></figcaption></figure>
}

export default function SearchExperience({ onError }) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('hybrid')
  const [topK, setTopK] = useState(5)
  const [compare, setCompare] = useState(false)
  const [preferences, setPreferences] = useState(storedPreferences)
  const [favoriteText, setFavoriteText] = useState(() => storedPreferences().favorite_terms.join(', '))
  const [response, setResponse] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [capabilities, setCapabilities] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([api.searchEvaluation(), api.searchCapabilities()]).then(([evaluationData, capabilityData]) => {
      setEvaluation(evaluationData); setCapabilities(capabilityData)
    }).catch(() => {})
  }, [])

  function persist(next) { setPreferences(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
  function togglePreference(field, title) {
    const opposite = field === 'liked_titles' ? 'disliked_titles' : 'liked_titles'
    const exists = preferences[field].includes(title)
    persist({ ...preferences, [field]: exists ? preferences[field].filter(item => item !== title) : [...preferences[field], title].slice(-50), [opposite]: preferences[opposite].filter(item => item !== title) })
  }
  function updateTerms(value) {
    setFavoriteText(value)
    persist({ ...preferences, favorite_terms: value.split(',').map(item => item.trim()).filter(Boolean).slice(0, 20) })
  }
  async function submit(event) {
    event.preventDefault()
    if (query.trim().length < 2) return onError('Enter at least two characters to search the music catalog.')
    setLoading(true); setResponse(null)
    const recent = [query.trim(), ...preferences.recent_searches.filter(item => item !== query.trim())].slice(0, 10)
    const nextPreferences = { ...preferences, recent_searches: recent }; persist(nextPreferences)
    try { setResponse(await api.search({ query, mode, top_k: Number(topK), personalize: !compare, compare, preferences: nextPreferences })) }
    catch { onError('The search and ranking service is currently unavailable.') }
    finally { setLoading(false) }
  }

  const primaryResults = response?.results || []
  return <section className="search-section" id="search"><header className="search-intro"><span>01 · SEARCH, RETRIEVAL & RANKING</span><h2>Search the Music Catalog</h2><p>Describe what you want in natural language. The engine retrieves candidates, ranks them using lexical and semantic signals, and returns the strongest matches.</p></header>
    <div className="search-feature-panel"><div className="search-feature-copy"><div className="search-feature-label"><span>SEARCH · HYBRID RETRIEVAL</span><h3>Catalog Ranking</h3></div><div className="search-pipeline" aria-label="Search ranking pipeline">{['Query','Retrieval','Candidates','Ranking','Re-ranking','Top-K'].map((item,index) => <React.Fragment key={item}><span>{item}</span>{index < 5 && <i>→</i>}</React.Fragment>)}</div><form className="search-form" onSubmit={submit}><label htmlFor="catalog-query">Natural-language query</label><div className="search-query-row"><input id="catalog-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try: uplifting acoustic worship music"/><button className="primary" disabled={loading}>{loading ? 'Ranking…' : 'Search & Rank'}</button></div><ExampleSuggestions examples={searchExamples} onSelect={setQuery} description="Natural-language search examples"/><div className="search-controls"><label>Retrieval mode<select value={mode} onChange={event => setMode(event.target.value)}><option value="lexical">Lexical · TF-IDF</option><option value="semantic">Semantic · latent vectors</option><option value="hybrid">Hybrid · combined signals</option></select></label><label>Results<select value={topK} onChange={event => setTopK(event.target.value)}>{[5,10,15,20].map(value => <option key={value}>{value}</option>)}</select></label><label className="check-control"><input type="checkbox" checked={compare} onChange={event => setCompare(event.target.checked)}/> Compare generic vs personalized</label></div><label htmlFor="favorite-terms">Favorite styles, artists, or keywords <small>Stored only in this browser</small></label><input id="favorite-terms" value={favoriteText} onChange={event => updateTerms(event.target.value)} placeholder="gospel, acoustic, piano"/><ExampleSuggestions examples={preferenceExamples} onSelect={updateTerms} description="Preference examples"/></form></div><SearchArtwork/></div>
    {loading && <div className="search-loading">Retrieving candidates → scoring → re-ranking…</div>}
    {response && <div className={`search-results ${response.generic_results ? 'comparison' : ''}`}><div className="search-result-summary"><span>{response.candidate_count} candidates scored</span><strong>{response.mode.toUpperCase()} · TOP {response.top_k}</strong></div>{response.generic_results ? <><ResultList title="Generic ranking" results={response.generic_results} onPreference={togglePreference} preferences={preferences}/><ResultList title="Personalized ranking" results={response.personalized_results} onPreference={togglePreference} preferences={preferences}/></> : <ResultList title={response.personalized ? 'Personalized ranking' : 'Ranked results'} results={primaryResults} onPreference={togglePreference} preferences={preferences}/>}</div>}
    <details className="research-notes"><summary>Evaluation &amp; research notes</summary><div className="research-notes-body"><p>{evaluation?.available ? 'A labeled evaluation dataset is configured for programmatic ranking evaluation.' : 'Ranking metrics such as Precision@K, Recall@K, MRR, and NDCG@K are implemented, but the current music dataset does not include independent relevance judgments, so benchmark scores are not reported.'}</p><dl><div><dt>Learning-to-Rank</dt><dd>{capabilities?.learning_to_rank.available ? 'Available.' : 'Not trained — no independent relevance labels are available.'}</dd></div><div><dt>Multimodal retrieval</dt><dd>{capabilities?.multimodal.available ? 'Available.' : 'Not enabled — the current deployable corpus does not include a local image dataset.'}</dd></div></dl></div></details>
  </section>
}
