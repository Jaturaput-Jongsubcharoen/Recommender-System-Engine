import React, { useEffect, useId, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { api } from './api'
import SearchExperience from './SearchExperience'
import ExampleSuggestions from './ExampleSuggestions'
import './styles.css'

const technologies = ['Python', 'FastAPI', 'React', 'Apriori', 'TF-IDF', 'Cosine Similarity']
const musicExamples = ['Piano Music To Dream By', "1970's Classic Rock", 'Celtic Worship: Live from Ireland']

const collageVariants = [
  { bg: '#E94D45', color: '#FAF8E9', font: 'Impact, Arial Black, sans-serif', weight: 700, style: 'normal', rotation: '-2deg', x: '-1px', y: '1px', scale: .98, width: '88%', height: '90%', size: '86%', shape: 'polygon(2% 4%, 98% 0, 96% 98%, 0 94%)' },
  { bg: '#171812', color: '#FAF8E9', font: 'Georgia, Times New Roman, serif', weight: 400, style: 'italic', rotation: '2deg', x: '1px', y: '-1px', scale: 1.02, width: '94%', height: '84%', size: '82%', shape: 'polygon(0 3%, 95% 0, 100% 94%, 5% 100%)' },
  { bg: '#FAF8E9', color: '#171812', font: 'Georgia, Times New Roman, serif', weight: 400, style: 'normal', rotation: '-1deg', x: '0px', y: '1px', scale: .96, width: '100%', height: '96%', size: '78%', shape: 'polygon(4% 0, 100% 5%, 96% 100%, 0 95%)' },
  { bg: '#B8B4AA', color: '#11110E', font: 'Courier New, monospace', weight: 700, style: 'normal', rotation: '1.5deg', x: '1px', y: '0px', scale: 1, width: '84%', height: '88%', size: '76%', shape: 'polygon(1% 6%, 96% 1%, 100% 96%, 3% 100%)' },
]

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

function CollageLetter({ char, state, index }) {
  const visual = collageVariants[(state.variant + index) % collageVariants.length]
  const displayChar = (state.variant + index) % 4 === 3 ? char.toLowerCase() : char
  return <span className="collage-letter-slot" aria-hidden="true"><span key={state.generation} className={`collage-letter-tile ${state.generation ? 'is-swapping' : ''}`} style={{
    '--tile-bg': visual.bg, '--tile-color': visual.color, '--tile-font': visual.font,
    '--tile-weight': visual.weight, '--tile-style': visual.style, '--tile-rotation': visual.rotation,
    '--tile-x': visual.x, '--tile-y': visual.y, '--tile-scale': visual.scale,
    '--tile-width': visual.width, '--tile-height': visual.height, '--tile-size': visual.size,
    '--tile-shape': visual.shape,
  }}>{displayChar}</span></span>
}

function CutWord({ children, variant = '' }) {
  const letters = [...children]
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const compact = useMediaQuery('(max-width: 520px)')
  const [letterStates, setLetterStates] = useState(() => letters.map((_, index) => ({ variant: index % collageVariants.length, generation: 0 })))

  useEffect(() => {
    if (reducedMotion) return undefined
    const order = compact ? [0, 2, 4, 1, 3, 5] : [1, 4, 0, 3, 5, 2, 4, 1, 5, 0, 2, 3]
    const timings = compact ? [1700, 2100, 1850, 2200] : [980, 1320, 1100, 1540, 1220]
    let step = 0
    let timer
    const swap = () => {
      const primary = order[step % order.length] % letters.length
      setLetterStates(current => current.map((item, index) => {
        const secondary = !compact && step % 6 === 5 && index === (primary + 3) % letters.length
        if (index !== primary && !secondary) return item
        return { variant: (item.variant + 1) % collageVariants.length, generation: item.generation + 1 }
      }))
      timer = setTimeout(swap, timings[step++ % timings.length])
    }
    const wordOffset = variant === 'sound' ? (compact ? 520 : 430) : 0
    timer = setTimeout(swap, (compact ? 1500 : 1100) + wordOffset)
    return () => clearTimeout(timer)
  }, [compact, letters.length, reducedMotion, variant])

  return <span className={`cut-word ${variant}`} aria-label={children}>{letters.map((letter, index) => <CollageLetter char={letter} state={letterStates[index]} index={index} key={`${letter}-${index}`}/>)}</span>
}

function Icon({ type }) {
  if (type === 'cuisine') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="8" r="3"/><circle cx="17" cy="7" r="2.5"/><circle cx="15" cy="17" r="3"/><path d="m9.5 9.5 3.2 5M9.8 7.7l4.8-.4"/></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17V9m4 11V4m5 13V7m5 10v-6"/></svg>
}

function NetworkVisual() {
  return <div className="network" aria-hidden="true"><span className="hero-crop-type">RECOMMEND</span><span className="hero-index">RSE / 01—02</span><svg className="hero-object" viewBox="0 0 520 390"><rect className="hero-red-block" x="238" y="52" width="210" height="210" transform="rotate(45 343 157)"/><g className="hero-eye"><circle className="hero-disc" cx="260" cy="205" r="118"/><circle className="hero-disc-line" cx="260" cy="205" r="78"/><circle className="hero-center" cx="260" cy="205" r="20"/></g><path className="draw-line" d="M75 274c72-123 189-172 351-122M394 126l35 24-37 21"/><path className="draw-line thin" d="M87 310c105 31 230 23 345-18"/></svg><span className="hero-script">match / discover</span><span className="hero-object-label">ASSOCIATION<br/>SIMILARITY<br/>RANKING</span></div>
}

function EngineArtwork({ type }) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setRevealed(true), { threshold: .25 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  if (type === 'cuisine') return <figure ref={ref} className={`engine-art cuisine-art ${revealed ? 'revealed' : ''}`}><svg viewBox="0 0 520 420" role="img"><title>Monochrome ingredients connected by an association path</title><rect className="art-red-shape" x="248" y="46" width="190" height="190" transform="rotate(45 343 141)"/><g className="mono-ingredients"><path d="M90 285c-40-82 12-152 85-145 66 7 91 84 52 140-34 49-108 54-137 5Z"/><path d="M181 150c8-49 28-77 62-99-3 42-20 76-62 99Z"/><path d="M265 305c-18-65 19-132 81-137 61-5 103 55 83 116-23 71-143 91-164 21Z"/><path d="M346 170c-6-46 8-83 42-112 8 52-4 88-42 112Z"/><circle cx="177" cy="230" r="38"/><circle cx="345" cy="265" r="42"/></g><path className="art-draw-line" d="M61 314C149 220 245 216 442 261M410 239l35 23-37 17"/><circle className="art-target" cx="177" cy="230" r="55"/><circle className="art-target" cx="345" cy="265" r="60"/></svg><figcaption><b>INGREDIENT NODES</b><span>support → confidence → lift</span></figcaption></figure>
  return <figure ref={ref} className={`engine-art music-art ${revealed ? 'revealed' : ''}`}><svg viewBox="0 0 520 420" role="img"><title>Monochrome record and speaker connected by a similarity waveform</title><circle className="art-red-shape" cx="334" cy="186" r="126"/><circle className="music-record" cx="216" cy="223" r="132"/><circle className="music-groove" cx="216" cy="223" r="88"/><circle className="music-center" cx="216" cy="223" r="22"/><rect className="speaker" x="325" y="95" width="126" height="220"/><circle className="speaker-cone" cx="388" cy="232" r="48"/><circle className="speaker-dot" cx="388" cy="141" r="16"/><path className="art-draw-line waveform" d="M47 336h34l13-49 22 91 26-119 23 77h41l16-55 22 55h51"/></svg><figcaption><b>VECTOR SPACE / TOP 10</b><span>text → TF-IDF → cosine</span></figcaption></figure>
}

function Metric({ label, value, tip }) {
  return <span className="metric"><strong>{label}</strong> {value}<button className="info" type="button" aria-label={`${label}: ${tip}`} title={tip}>i</button></span>
}

function readableIngredient(value) {
  const words = String(value).replaceAll('_', ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function ingredientList(values) {
  return values.map(readableIngredient).join(' + ')
}

function AssociationRule({ rule }) {
  const from = ingredientList(rule.from)
  const to = ingredientList(rule.to)
  const confidence = `${(Number(rule.confidence) * 100).toFixed(1)}%`
  const support = `${(Number(rule.support) * 100).toFixed(1)}%`
  const lift = `${Number(rule.lift).toFixed(2)}×`
  return <article className="rule">
    <div className="rule-story">
      <div><span>When a recipe contains</span><strong>{from}</strong></div>
      <b className="rule-arrow" aria-hidden="true">→</b>
      <div><span>It is likely to also contain</span><strong>{to}</strong></div>
    </div>
    <div className="relationship-strength"><span>How strong is this relationship?</span><div className="metric-explanations">
      <div><strong>{confidence} <small>Confidence</small></strong><p>Among recipes containing {from.toLowerCase()}, about {Math.round(Number(rule.confidence) * 100)}% also contain {to.toLowerCase()}.</p></div>
      <div><strong>{lift} <small>Lift</small></strong><p>{to} is about {Number(rule.lift).toFixed(1)} times more likely to appear with this ingredient combination than expected by chance.</p></div>
      <div><strong>{support} <small>Support</small></strong><p>About {(Number(rule.support) * 100).toFixed(1)}% of the analyzed recipe transactions contain this complete combination.</p></div>
    </div></div>
    <details className="technical-details"><summary>Technical metric values</summary><div className="metrics"><Metric label="Support" value={rule.support} tip="How often the complete ingredient combination appears in the analyzed recipes."/><Metric label="Confidence" value={rule.confidence} tip="How often the predicted ingredient appears when the starting ingredients are present."/><Metric label="Lift" value={rule.lift} tip="How much stronger this relationship is compared with normal chance."/></div></details>
  </article>
}

function PlainHowExplanations() {
  return <div className="how-explainers" aria-label="Recommendation models in plain English">
    <article><span>Search, retrieval & ranking · plain English</span><h3>How does catalog search work?</h3><p>The system takes a natural-language query, finds a larger group of potentially relevant music, scores those candidates using lexical and semantic signals, then re-ranks them to return the strongest Top-K results.</p></article>
    <article><span>Cuisine model · plain English</span><h3>How does the cuisine recommender work?</h3><p>The system examines recipe ingredient combinations and looks for patterns. If certain ingredients repeatedly appear together, Apriori identifies that relationship and measures how reliable it is.</p></article>
    <article><span>Music model · plain English</span><h3>How does the music recommender work?</h3><p>The system compares descriptive information about music. TF-IDF converts that information into numerical features, and cosine similarity measures which titles are most alike.</p></article>
  </div>
}

function SearchAlgorithmCard() {
  return <article className="search-algorithm-card"><div className="algorithm-top"><Icon type="music"/><span>SEARCH · RETRIEVAL & RANKING</span></div><h3>Natural-Language Catalog Search</h3><p>Starts from a description, retrieves a broad candidate set, calculates supported relevance features, ranks the candidates, and applies diversity-aware re-ranking.</p><div className="pipeline"><span>Query</span><i>↓</i><span>Retrieval</span><i>↓</i><span>Candidates</span><i>↓</i><span>Ranking</span><i>↓</i><span>Re-ranking</span><i>↓</i><span>Top-K Results</span></div><div className="retrieval-mode-notes"><div><strong>Lexical</strong><p>Matches words and text features using TF-IDF.</p></div><div><strong>Semantic</strong><p>Finds conceptually similar content even when exact words differ.</p></div><div><strong>Hybrid</strong><p>Combines lexical, semantic, and available metadata signals.</p></div></div><p className="personalization-note">When personalization is enabled, locally stored preference terms and interactions can adjust ranking scores.</p></article>
}

function CuisineEngine({ cuisines, onError }) {
  const listId = useId()
  const [cuisine, setCuisine] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeOption, setActiveOption] = useState(-1)
  const matchingCuisines = cuisines.filter(item => item.toLowerCase().includes(cuisine.trim().toLowerCase()))
  const preferredExamples = ['french', 'thai', 'mexican']
  const cuisineExamples = preferredExamples.map(preferred => cuisines.find(item => item.toLowerCase() === preferred)).filter(Boolean)

  function chooseCuisine(value) {
    setCuisine(value)
    setOpen(false)
    setActiveOption(-1)
  }

  function handleCuisineKeys(event) {
    if (event.key === 'Escape') { setOpen(false); setActiveOption(-1); return }
    if (!open || !matchingCuisines.length) return
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveOption(index => Math.min(index + 1, matchingCuisines.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActiveOption(index => Math.max(index - 1, 0)) }
    if (event.key === 'Enter' && activeOption >= 0) { event.preventDefault(); chooseCuisine(matchingCuisines[activeOption]) }
  }

  async function submit(event) {
    event.preventDefault()
    if (!cuisine.trim()) return onError('Choose a supported cuisine to continue.')
    setLoading(true); setResult(null); onError('')
    try { setResult(await api.cuisineRecommendations(cuisine)) }
    catch (error) { onError(error.status === 404 ? `We couldn't find recommendations for that cuisine.` : 'The recommendation service is currently unavailable.') }
    finally { setLoading(false) }
  }

  return <article className="engine-card cuisine-engine">
    <div className="card-heading"><div className="icon-box violet"><Icon type="cuisine" /></div><div><span className="kicker">APRIORI · ASSOCIATION RULES</span><h2>Cuisine Patterns</h2></div></div>
    <p className="card-copy">Discover ingredients that frequently belong together using Apriori association rules.</p>
    <EngineArtwork type="cuisine" />
    <form onSubmit={submit}><label htmlFor="cuisine-input">Search supported cuisines</label><div className="input-row"><div className="cuisine-search"><input id="cuisine-input" value={cuisine} onChange={(event) => { setCuisine(event.target.value); setOpen(true); setActiveOption(-1) }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)} onKeyDown={handleCuisineKeys} placeholder="Try Italian, Thai, Mexican…" autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={listId}/><span className="select-arrow" aria-hidden="true">▾</span>{open && matchingCuisines.length > 0 && <div className="cuisine-options" id={listId} role="listbox">{matchingCuisines.map((item, index) => <button type="button" role="option" aria-selected={index === activeOption} className={index === activeOption ? 'active' : ''} key={item} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseCuisine(item)}>{item}</button>)}</div>}</div><button className="primary" disabled={loading}>{loading && <span className="spinner"/>}{loading ? 'Analyzing…' : 'Analyze Cuisine'}</button></div><ExampleSuggestions examples={cuisineExamples} onSelect={chooseCuisine} formatExample={readableIngredient} description="Supported cuisine examples"/><p className="input-hint">{cuisines.length ? `${cuisines.length} cuisines available` : 'Loading supported cuisines…'}</p></form>
    {loading && <div className="skeleton-stack" aria-label="Analyzing ingredient relationships"><span/><span/><span/></div>}
    {result && <div className="result-panel reveal"><header className="result-introduction"><span>Your Cuisine Analysis</span><h3>{readableIngredient(result.cuisine)} ingredient patterns</h3><p>We analyzed recipe patterns for {readableIngredient(result.cuisine)} cuisine to find ingredients that frequently appear together. Below are the strongest ingredient relationships discovered by the Apriori model.</p></header><div className="result-label"><span>Frequently Paired Ingredients</span><small>{result.cuisine}</small></div><p className="result-explanation">These ingredients frequently appear together in the {readableIngredient(result.cuisine)} recipes analyzed by the model.</p><div className="chips">{result.top_ingredients.length ? result.top_ingredients.map(item => <span key={item}>{readableIngredient(item)}</span>) : <p>No frequent ingredient group was found.</p>}</div><div className="result-flow" aria-label="How to read the results"><span>Ingredients we found</span><i>↓</i><span>When these appear</span><i>↓</i><span>Another ingredient often appears too</span><i>↓</i><span>Relationship strength</span></div><div className="rules-title"><h3>Association Rules</h3><span>{result.rules.length} relationships</span></div><div className="rules">{result.rules.length ? result.rules.slice(0, 8).map((rule, index) => <AssociationRule rule={rule} key={index}/>) : <p className="empty">No association rules exceeded the lift threshold for this cuisine.</p>}</div></div>}
  </article>
}

function MusicEngine({ onError }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  function chooseTitle(title) {
    setQuery(title); setResult(null)
  }

  async function find(title = query) {
    if (!title.trim()) return onError('Enter a song or album title to continue.')
    setQuery(title); setResult(null); setLoading(true); onError('')
    try { setResult(await api.musicRecommendations(title)) }
    catch (error) { onError(error.status === 404 ? `We couldn't find recommendations for that title.` : 'The recommendation service is currently unavailable.') }
    finally { setLoading(false) }
  }

  return <article className="engine-card music-engine">
    <div className="card-heading"><div className="icon-box cyan"><Icon type="music" /></div><div><span className="kicker">TF-IDF · COSINE SIMILARITY</span><h2>Similar Sounds</h2></div></div>
    <p className="card-copy">Start from a known music title and discover other titles with similar content features.</p>
    <EngineArtwork type="music" />
    <form onSubmit={(event) => { event.preventDefault(); find() }}><label htmlFor="music-input">Enter a song or album title</label><div className="search-wrap"><div className="input-row"><div className="music-title-search"><input id="music-input" value={query} onChange={(event) => { setQuery(event.target.value); setResult(null) }} placeholder="Type a song or album title…" autoComplete="off"/><button type="button" className="clear" aria-label="Clear music title" onClick={() => { setQuery(''); setResult(null) }}>×</button></div><button className="primary cyan-button" disabled={loading}>{loading && <span className="spinner"/>}{loading ? 'Finding…' : 'Find Similar Music'}</button></div></div><ExampleSuggestions examples={musicExamples} onSelect={chooseTitle} description="Known music-title examples"/><p className="input-hint">Type a known catalog title, or use an example to get started.</p></form>
    {loading && <div className="skeleton-stack" aria-label="Finding similar music"><span/><span/><span/></div>}
    {result && <div className="result-panel reveal"><header className="result-introduction"><span>Your Music Recommendations</span><h3>Matches for “{result.title}”</h3><p>Based on the title you selected, the model compared its content features with the music catalog and ranked the most similar matches.</p></header><div className="result-label"><span>Ranked Similar Titles</span><small>most similar first</small></div><p className="result-explanation">Titles near the top are considered more closely related by the model. The API returns ranking order only, so no similarity percentage is shown.</p><ol className="music-list">{result.recommendations.map((title, index) => <li key={`${title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><small>{index === 0 ? 'Closest content match' : `Similarity rank ${index + 1}`}</small></div></li>)}</ol></div>}
    <div className="tech-notes"><div><strong>TF-IDF</strong><p>Transforms descriptive text into weighted numerical features.</p></div><div><strong>Cosine Similarity</strong><p>Measures how similar two content vectors are.</p></div></div>
  </article>
}

function App() {
  const [cuisines, setCuisines] = useState([])
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    api.cuisines().then(data => setCuisines(data.cuisines)).catch(() => setError('Unable to connect to the recommendation API. Please try again.'))
  }, [])

  useEffect(() => {
    const sections = ['overview', 'how-it-works', 'search', 'cuisine', 'music'].map(id => document.getElementById(id)).filter(Boolean)
    let frameId = null

    const updateActiveSection = () => {
      frameId = null
      const marker = window.scrollY + 66 + window.innerHeight * .22
      const current = sections.reduce((active, section) => section.offsetTop <= marker ? section : active, sections[0])
      if (current) setActiveSection(current.id)
    }
    const handleScroll = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  return <div className="app-shell">
    <nav className="nav"><a className="brand" href="#overview" onClick={() => setActiveSection('overview')}><span className="brand-mark"><i/><i/><i/></span><span>Recommender <b>System Engine</b></span></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span/><span/><span/></button><div className={`nav-links ${menuOpen ? 'open' : ''}`}><a className={activeSection === 'overview' ? 'active' : ''} aria-current={activeSection === 'overview' ? 'page' : undefined} onClick={() => { setActiveSection('overview'); closeMenu() }} href="#overview">Overview</a><a className={activeSection === 'how-it-works' ? 'active' : ''} aria-current={activeSection === 'how-it-works' ? 'page' : undefined} onClick={() => { setActiveSection('how-it-works'); closeMenu() }} href="#how-it-works">How It Works</a><a className={activeSection === 'search' ? 'active' : ''} aria-current={activeSection === 'search' ? 'page' : undefined} onClick={() => { setActiveSection('search'); closeMenu() }} href="#search">Search</a><a className={activeSection === 'cuisine' ? 'active' : ''} aria-current={activeSection === 'cuisine' ? 'page' : undefined} onClick={() => { setActiveSection('cuisine'); closeMenu() }} href="#cuisine">Cuisine</a><a className={activeSection === 'music' ? 'active' : ''} aria-current={activeSection === 'music' ? 'page' : undefined} onClick={() => { setActiveSection('music'); closeMenu() }} href="#music">Music</a></div></nav>
    <main><section className="hero" id="overview"><div className="hero-copy"><div className="eyebrow"><span/> INTERACTIVE ML PROJECT · 2026</div><h1><span>Find Your Next</span><span className="collage-line"><CutWord variant="flavor">FLAVOR</CutWord><small>or</small><CutWord variant="sound">SOUND</CutWord></span></h1><p>Explore three recommendation and retrieval approaches powered by search ranking, association-rule mining, and content-based similarity.</p><div className="badges">{technologies.map(tech => <span key={tech}>{tech.toUpperCase()}</span>)}</div><div className="actions"><a className="button primary" href="#search">Explore Search <span>→</span></a><a className="button secondary" href="#cuisine">Explore Cuisine <span>→</span></a><a className="button secondary" href="#music">Explore Music <span>→</span></a></div><p className="creator-byline">Designed &amp; developed by <strong>Jaturaput (Mac) Jongsubcharoen</strong></p></div><NetworkVisual/></section>
      {error && <div className="global-error" role="alert"><span>!</span><p>{error}</p><button onClick={() => setError('')} aria-label="Dismiss error">×</button></div>}
      <section className="how" id="how-it-works"><div className="intro"><span>HOW THE ENGINES THINK</span><h2>Three paths to useful recommendations</h2><p>Beginner-friendly explanations paired with the technical machine-learning and retrieval pipelines.</p></div><PlainHowExplanations/><div className="algorithm-grid"><SearchAlgorithmCard/><article><div className="algorithm-top"><Icon type="cuisine"/><span>CUISINE · ASSOCIATION MINING</span></div><h3>Apriori Association Rules</h3><p>Surfaces meaningful ingredient relationships from thousands of recipe transactions.</p><div className="pipeline"><span>Recipes</span><i>↓</i><span>Ingredient Transactions</span><i>↓</i><span>Apriori</span><i>↓</i><span>Association Rules</span><i>↓</i><span>Recommendations</span></div><div className="algorithm-tags"><span>Support</span><span>Confidence</span><span>Lift</span></div></article><article><div className="algorithm-top cyan-text"><Icon type="music"/><span>MUSIC · CONTENT-BASED</span></div><h3>Content-Based Recommendation</h3><p>Converts music metadata into a mathematical feature space for precise similarity ranking.</p><div className="pipeline"><span>Music Metadata</span><i>↓</i><span>Text Features</span><i>↓</i><span>TF-IDF</span><i>↓</i><span>Cosine Similarity</span><i>↓</i><span>Top Matches</span></div><div className="algorithm-tags cyan-tags"><span>Vectorization</span><span>Top 10 ranking</span></div></article></div><div className="system-strip"><span>REACT FRONTEND</span><i>→</i><span>FASTAPI REST API</span><i>→</i><span>RECOMMENDATION SERVICES</span><i>→</i><span>RESULTS</span></div></section>
      <SearchExperience onError={setError}/>
      <section className="engine-section cuisine-section" id="cuisine"><div className="intro"><span>02 · APRIORI RECOMMENDATION ENGINE</span><h2>Explore the Cuisine Model</h2><p>Start with cuisine patterns and uncover ingredients that frequently belong together.</p></div><div className="single-engine"><CuisineEngine cuisines={cuisines} onError={setError}/></div></section>
      <section className="engine-section music-section" id="music"><div className="intro"><span>03 · CONTENT-BASED RECOMMENDATION ENGINE</span><h2>Explore the Music Model</h2><p>Start from a known music title and discover other titles with similar content features.</p></div><div className="single-engine"><MusicEngine onError={setError}/></div></section>
    </main><footer><div className="brand"><span className="brand-mark"><i/><i/><i/></span><span>Recommender System Engine</span></div><div className="footer-credit"><strong>By Jaturaput (Mac) Jongsubcharoen</strong><span>Built with Python · FastAPI · React · Docker · GitHub Actions</span></div></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
