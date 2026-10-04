'use client'

import { Button, useSelection, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const ACTIONS = [
  { status: 'in_progress', label: 'Marquer en cours' },
  { status: 'done', label: 'Marquer traitées' },
  { status: 'archived', label: 'Archiver' },
] as const

/** Bulk actions for leads: the server revalidates each row and reports updated vs skipped. */
export function LeadBulkActions() {
  const { selectedIDs, selectAll, totalDocs } = useSelection()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState<string | null>(null)

  const ids = selectedIDs.map(String)
  const disabled = busy || ids.length === 0

  async function run(status: string) {
    setBusy(true)
    try {
      const res = await fetch('/api/leads/bulk-status', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      const skippedText = data.skipped ? `, ${data.skipped} ignorée(s) car non éligible(s)` : ''
      toast.success(`${data.updated} demande(s) mise(s) à jour${skippedText}.`)
      router.refresh()
    } catch (error) {
      toast.error(`L’action n’a pas abouti : ${(error as Error).message}. Réessayez.`)
    } finally {
      setBusy(false)
      setConfirming(null)
    }
  }

  function exportCsv() {
    const anchor = document.createElement('a')
    anchor.href = `/api/leads/export?ids=${encodeURIComponent(ids.join(','))}`
    anchor.download = ''
    anchor.click()
    toast.success(`${ids.length} demande(s) exportée(s).`)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '0 0 16px' }}>
      <strong style={{ marginRight: 8 }}>
        {ids.length ? `${ids.length} demande(s) sélectionnée(s)` : 'Cochez des demandes pour agir sur plusieurs à la fois'}
        {String(selectAll) === 'allAvailable' && totalDocs > ids.length
          ? ' — seules les lignes de cette page sont concernées'
          : ''}
      </strong>
      {ACTIONS.map((action) =>
        action.status === 'archived' && confirming === 'archived' ? (
          <span key={action.status} style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            Archiver {ids.length} demande(s) ?
            <Button size="small" buttonStyle="primary" disabled={disabled} onClick={() => run('archived')}>Confirmer</Button>
            <Button size="small" buttonStyle="secondary" onClick={() => setConfirming(null)}>Annuler</Button>
          </span>
        ) : (
          <Button
            key={action.status}
            size="small"
            buttonStyle="secondary"
            disabled={disabled}
            onClick={() => (action.status === 'archived' ? setConfirming('archived') : run(action.status))}
          >
            {action.label}
          </Button>
        ),
      )}
      <Button size="small" buttonStyle="secondary" disabled={disabled} onClick={exportCsv}>
        Exporter (CSV)
      </Button>
    </div>
  )
}
