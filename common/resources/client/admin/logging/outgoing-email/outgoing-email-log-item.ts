export interface OutgoingEmailLogItem {
  id: number;
  message_id: string;
  status: 'sent' | 'not-sent' | 'error';
  from: string;
  to: string;
  subject: string;
  parsed_message?: {
    headers: Record<string, string>;
    body: {
      html: string;
      text: string;
    };
  };
  created_at: string;
  updated_at: string;
}
