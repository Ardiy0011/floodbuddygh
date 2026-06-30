// Display metadata for the legal pages. The *versions* recorded as consent are
// authoritative on the backend (backend/src/legal/versions.js) and flow to the
// client via the API; the values here drive what the policy pages SHOW, so keep
// them in sync when you bump a version.
export const LEGAL_META = {
  terms: { version: '1.0', effectiveDate: '30 June 2026' },
  privacy: { version: '1.0', effectiveDate: '30 June 2026' },

  // Operator / data-controller details. Replace before going live.
  operator: {
    name: 'FloodBuddy',
    legalName: 'FloodBuddy (the "Operator")',
    email: 'privacy@floodbuddy.example.com',
    address: 'Accra, Ghana',
    jurisdiction: 'Republic of Ghana',
  },

  // Ghana Data Protection Commission — for the data-subject complaint route.
  dpc: {
    name: 'Data Protection Commission, Ghana',
    email: 'info@dataprotection.org.gh',
    phone: '+233 256 301 533',
    portal: 'https://app.dataprotection.org.gh',
    website: 'https://dataprotection.org.gh',
  },
};
