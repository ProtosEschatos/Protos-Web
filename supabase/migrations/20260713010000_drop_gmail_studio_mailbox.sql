-- Gmail studio IMAP removed from admin inbox (abe7c28); align check constraint.
alter table public.admin_mail_sync
  drop constraint if exists admin_mail_sync_mailbox_id_check;

alter table public.admin_mail_sync
  add constraint admin_mail_sync_mailbox_id_check
  check (mailbox_id in ('zoho', 'martina'));

delete from public.admin_mail_sync
where mailbox_id = 'gmail-studio';
