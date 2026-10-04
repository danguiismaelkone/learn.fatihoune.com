type Props = { defaultValue?: string; variant?: 'hero' | 'page' | 'util'; id?: string }

/** Plain GET form: works without JavaScript and keeps the query in the URL (shareable, back button friendly). */
export function SearchForm({ defaultValue = '', variant = 'page', id = 'search-q' }: Props) {
  return (
    <form className={`search search--${variant}`} action="/recherche" method="get" role="search">
      <label className="sr-only" htmlFor={id}>Rechercher une formation</label>
      <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        className="search__input"
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={variant === 'util' ? 'Rechercher une formation' : 'Ex. Excel, management, ISO 45001, fiscalité…'}
        autoComplete="off"
        enterKeyHint="search"
        maxLength={80}
      />
      <button className="btn btn--primary search__button" type="submit">{variant === 'util' ? 'OK' : 'Rechercher'}</button>
    </form>
  )
}
