declare module 'imapflow' {
  export class ImapFlow {
    constructor(options: Record<string, unknown>)
    connect(): Promise<void>
    logout(): Promise<void>
    getMailboxLock(path: string): Promise<{ release(): void }>
    search(
      query: Record<string, unknown>,
      options?: { uid?: boolean },
    ): Promise<number[] | false>
    fetch(
      range: number[] | { uid: number },
      query: Record<string, unknown>,
      options?: { uid?: boolean },
    ): AsyncIterable<{
      uid: number
      envelope?: {
        subject?: string
        date?: Date
        from?: Array<{ name?: string; address?: string }>
        to?: Array<{ name?: string; address?: string }>
      }
      flags?: Set<string>
      source?: Buffer
    }>
  }
}
