module.exports = name => [
  { get: { controller: name } },
  { post: { controller: name, as: '', action: 'create' } },
  { get: { controller: name, as: 'new', action: 'new' }}, // Return create form for this model
  { get: { controller: name, as: ':id', action: 'show' }},
  { get: { controller: name, as: ':id/edit', action: 'edit' }}, // Return edit form for this model
  { put: { controller: name, as: ':id', action: 'update' }},
  { patch: { controller: name, as: ':id', action: 'update' }},
  { delete: { controller: name, as: ':id', as: '', action: 'destroy' }}
]
