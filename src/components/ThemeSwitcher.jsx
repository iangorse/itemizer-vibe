import React from 'react';

const themes = [
  { key: 'light', label: 'Light' },
  { key: 'blue', label: 'Blue' },
  { key: 'green', label: 'Green' },
];

function ThemeSwitcher() {
  const current = document.documentElement.getAttribute('data-theme') || '';

  const setTheme = (theme) => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'blue');
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '0.5em', alignItems: 'center', fontSize: '0.98em', margin: '0.5em 0' }}>
      <span style={{ fontWeight: 500 }}>Theme:</span>
      {themes.map(t => (
        <button
          key={t.key}
          className={`btn btn-sm${current === t.key ? ' btn-primary' : ' btn-outline-primary'}`}
          style={{ padding: '0.3em 0.7em', minWidth: 0 }}
          onClick={() => setTheme(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
