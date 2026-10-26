const BRANCH_MAP: Record<string, string> = {
  cs: 'CSE',
  ds: 'DSAI',
  da: 'DSAI',
  ec: 'ECE',
  ai: 'AIC',
}

/**
 * Parses an IIIT Dharwad email local part (e.g. "26bcs001") into
 * roll number, batch year, and discipline.
 */
export function parseRollFromEmail(email: string) {
  const local = email.split('@')[0].toLowerCase()
  const match = local.match(/^([0-9]{2})b(cs|ds|da|ec|ai)([0-9]+)$/)
  if (!match) return null

  const batch = 2000 + parseInt(match[1], 10)
  const discipline = BRANCH_MAP[match[2]]

  return { roll: local, batch, discipline }
}
