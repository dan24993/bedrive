<?php

namespace Common\Logging\Mail;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use ZBateson\MailMimeParser\Message;

class OutgoingEmailLogController extends BaseController
{
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function show(int $id): mixed
    {
        $logItem = OutgoingEmailLogItem::findOrFail($id);

        $message = Message::from($logItem->mime, true);

        $logItem->parsed_message = [
            'headers' => collect($message->getAllHeaders())->mapWithKeys(
                fn($header) => [$header->getName() => $header->getValue()],
            ),
            'body' => [
                'text' => $message->getTextContent(),
                'html' => $message->getHtmlContent(),
            ],
        ];

        return $this->success([
            'logItem' => $logItem,
        ]);
    }

    public function index(): mixed
    {
        $pagination = (new Datasource(
            OutgoingEmailLogItem::query(),
            request()->all(),
        ))->paginate();

        return $this->success([
            'pagination' => $pagination,
        ]);
    }

    public function downloadLog()
    {
        $log = json_encode(
            OutgoingEmailLogItem::limit(1000)->get(),
            JSON_PRETTY_PRINT,
        );

        return response($log)
            ->header('Content-Type', 'application/json')
            ->header(
                'Content-Disposition',
                'attachment; filename="outgoing-email-log.json"',
            );
    }

    public function downloadLogItem(int $id)
    {
        $logItem = OutgoingEmailLogItem::findOrFail($id);

        return response($logItem->mime)
            ->header('Content-Type', 'message/rfc822')
            ->header(
                'Content-Disposition',
                "attachment; filename=\"{$logItem->subject}.eml\"",
            );
    }
}
