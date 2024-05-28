<?php

namespace Common\Logging\Mail;

use Illuminate\Events\Dispatcher;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;

class OutgoingEmailLogSubscriber
{
    public function handleSending(MessageSending $event): void
    {
        $headers = $event->message->getPreparedHeaders();

        $logItem = OutgoingEmailLogItem::create([
            'message_id' => $headers->get('Message-ID')->getBodyAsString(),
            'from' => $headers->get('From')->getBodyAsString(),
            'to' => $headers->get('To')->getBodyAsString(),
            'subject' => $headers->get('Subject')->getBodyAsString(),
            'mime' => utf8_encode($event->message->toString()),
            'status' => 'not-sent',
        ]);

        $event->message
            ->getHeaders()
            ->addTextHeader('X-BE-LOG-ID', $logItem->id);
    }

    public function handleSent(MessageSent $event): void
    {
        $logId = $event->message
            ->getHeaders()
            ->get('X-BE-LOG-ID')
            ->getBodyAsString();

        OutgoingEmailLogItem::where('id', $logId)->update([
            'status' => 'sent',
            'message_id' => $event->sent
                ->getSymfonySentMessage()
                ->getMessageId(),
        ]);
    }

    public function subscribe(Dispatcher $events): array
    {
        return [
            MessageSending::class => 'handleSending',
            MessageSent::class => 'handleSent',
        ];
    }
}
