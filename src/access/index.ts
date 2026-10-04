import type { Access, FieldAccess, PayloadRequest } from 'payload'

type Role = 'admin' | 'editor'

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const user = req.user as { roles?: Role[] } | null | undefined
  return Boolean(user?.roles?.some((role) => roles.includes(role)))
}

export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const isStaff: Access = ({ req }) => hasRole(req, 'admin', 'editor')
export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')

/** Public visitors only see published documents; staff see everything. */
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(req, 'admin', 'editor')) return true
  return { status: { equals: 'published' } }
}

/** Destructive operations are disabled: content is archived/unpublished instead. */
export const nobody: Access = () => false
