import Link from 'next/link'
import { Heading, Section } from '@/components/primitives'

export default function NotFound() {
  return (
    <Section>
      <div className="stack">
        <Heading as="h1">Cette page n’existe pas ou a été déplacée</Heading>
        <p className="text text--soft">Vérifiez l’adresse, ou repartez de l’une de ces pages.</p>
        <div className="cluster">
          <Link className="btn btn--primary" href="/formations">Voir les formations</Link>
          <Link className="btn btn--secondary" href="/contact">Nous contacter</Link>
          <Link className="link" href="/">Retour à l’accueil</Link>
        </div>
      </div>
    </Section>
  )
}
