import { useMemo, useState } from 'react';

import HierarchyTree from './components/HierarchyTree';
import { submitHierarchyData } from './lib/api';
import './App.css';

const SAMPLE_INPUT = [
  'A->B',
  'A->C',
  'B->D',
  'C->E',
  'E->F',
  'X->Y',
  'Y->Z',
  'Z->X',
  'P->Q',
  'Q->R',
  'G->H',
  'G->H',
  'G->I',
  'hello',
  '1->2',
  'A->',
].join('\n');

function ResultList({ title, items, emptyMessage }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>{title}</h2>
      </div>
      {items.length > 0 ? (
        <ul className="pill-list">
          {items.map((item) => (
            <li key={item} className="pill-item">
              <code>{item}</code>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-copy">{emptyMessage}</p>
      )}
    </section>
  );
}

function Summary({ summary }) {
  return (
    <section className="panel summary-panel">
      <div className="panel-heading">
        <h2>Summary</h2>
      </div>
      <dl className="summary-grid">
        <div>
          <dt>Total trees</dt>
          <dd>{summary.total_trees}</dd>
        </div>
        <div>
          <dt>Total cycles</dt>
          <dd>{summary.total_cycles}</dd>
        </div>
        <div>
          <dt>Largest tree root</dt>
          <dd>{summary.largest_tree_root || 'N/A'}</dd>
        </div>
      </dl>
    </section>
  );
}

function IdentityCard({ result }) {
  return (
    <section className="panel summary-panel">
      <div className="panel-heading">
        <h2>Backend identity</h2>
      </div>
      <dl className="identity-grid">
        <div>
          <dt>User ID</dt>
          <dd>{result.user_id}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd className="identity-email">{result.email_id}</dd>
        </div>
        <div>
          <dt>College roll number</dt>
          <dd>{result.college_roll_number}</dd>
        </div>
      </dl>
    </section>
  );
}

function App() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lineCount = useMemo(() => input.replace(/\r/g, '').split('\n').length, [input]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await submitHierarchyData(input);
      setResult(response);
    } catch (submissionError) {
      setResult(null);
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-panel hero-grid">
        <div>
          <p className="eyebrow">SRM Full Stack Engineering Challenge</p>
          <h1>Node hierarchy analyzer</h1>
          <p className="hero-copy">
            Enter the node list, submit it to the hosted <code>/bfhl</code> API, and review the
            structured response as hierarchy cards, summary metrics, and validation results.
          </p>
        </div>
        <div className="endpoint-card">
          <p className="endpoint-label">Connected endpoint</p>
          <code className="endpoint-code">POST /bfhl</code>
          <p className="endpoint-copy">
            The frontend sends your input as <code>{`{ "data": [...] }`}</code> and displays the
            returned hierarchy analysis in a readable format.
          </p>
        </div>
      </section>

      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Enter node list</h2>
          <span className="line-count">{lineCount} line(s)</span>
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <label className="sr-only" htmlFor="edge-input">
            Node relationships
          </label>
          <textarea
            id="edge-input"
            className="edge-textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck="false"
            placeholder="A->B&#10;A->C&#10;B->D"
          />
          <p className="input-helper">
            Add one relationship per line. Example: <code>A-&gt;B</code>, <code>A-&gt;C</code>,{' '}
            <code>B-&gt;D</code>
          </p>
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit to /bfhl'}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setInput(SAMPLE_INPUT)}
              disabled={isSubmitting}
            >
              Load sample input
            </button>
          </div>
        </form>
        {error ? (
          <p className="error-banner">
            API request failed. Please check the hosted backend URL and try again. Details: {error}
          </p>
        ) : null}
      </section>

      {result ? (
        <section className="results-layout">
          <section className="panel hierarchies-panel">
            <div className="panel-heading">
              <h2>Hierarchy response</h2>
              <span className="line-count">{result.hierarchies.length} component(s)</span>
            </div>
            <div className="hierarchy-list">
              {result.hierarchies.map((hierarchy) => (
                <article key={hierarchy.root} className="hierarchy-card">
                  <div className="hierarchy-header">
                    <div>
                      <p className="meta-label">Root</p>
                      <h3>{hierarchy.root}</h3>
                    </div>
                    <div className="hierarchy-meta">
                      {hierarchy.has_cycle ? (
                        <span className="status-pill status-cycle">Cycle detected</span>
                      ) : (
                        <span className="status-pill status-tree">Depth: {hierarchy.depth}</span>
                      )}
                    </div>
                  </div>
                  <HierarchyTree tree={hierarchy.tree} />
                </article>
              ))}
            </div>
          </section>

          <div className="side-panels">
            <IdentityCard result={result} />
            <Summary summary={result.summary} />
            <ResultList
              title="Invalid entries"
              items={result.invalid_entries}
              emptyMessage="No invalid entries were found."
            />
            <ResultList
              title="Duplicate edges"
              items={result.duplicate_edges}
              emptyMessage="No duplicate edges were found."
            />
          </div>
        </section>
      ) : (
        <section className="panel empty-state-panel">
          <h2>Ready for API response</h2>
          <p className="empty-copy">
            Submit the node list to <code>/bfhl</code> to render hierarchies, invalid entries,
            duplicate edges, and the response summary here.
          </p>
        </section>
      )}
    </main>
  );
}

export default App;
