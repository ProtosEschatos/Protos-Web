export const DONATION_CAUSES = ['cyber', 'education', 'platforms'] as const
export type DonationCause = (typeof DONATION_CAUSES)[number]

export const DONATION_TARGETS: Record<DonationCause, number> = {
  cyber: 10_000,
  education: 10_000,
  platforms: 20_000,
}

export const DONATION_MIN_EUR = 1
export const DONATION_MAX_EUR = 1000

export type DonationGoalStats = {
  cause: DonationCause
  raised: number
  target: number
  progress: number
}

export function isDonationCause(value: string): value is DonationCause {
  return (DONATION_CAUSES as readonly string[]).includes(value)
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function buildDefaultStats(): DonationGoalStats[] {
  return DONATION_CAUSES.map((cause) => ({
    cause,
    raised: 0,
    target: DONATION_TARGETS[cause],
    progress: 0,
  }))
}

export function statsFromTotals(
  rows: Array<{ cause: string; total: number }> | null | undefined,
): DonationGoalStats[] {
  const totals = new Map<string, number>()
  for (const row of rows ?? []) {
    if (isDonationCause(row.cause)) {
      totals.set(row.cause, Number(row.total) || 0)
    }
  }

  return DONATION_CAUSES.map((cause) => {
    const raised = totals.get(cause) ?? 0
    const target = DONATION_TARGETS[cause]
    const progress = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0
    return { cause, raised, target, progress }
  })
}
