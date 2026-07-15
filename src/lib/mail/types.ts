/** Edge-safe mail types — no IMAP / Node imports. */

export type MailListItem = {
  uid: number
  subject: string
  from: string
  to: string
  date: string | null
  seen: boolean
  preview: string
}

export type MailMessage = MailListItem & {
  text: string
  html: string | null
}
