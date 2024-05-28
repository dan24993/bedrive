<?php

namespace Common\Logging\Mail;

use Common\Core\BaseModel;
use Illuminate\Database\Eloquent\Casts\Attribute;

class OutgoingEmailLogItem extends BaseModel
{
    const MODEL_TYPE = 'outgoing_email_log_item';

    protected $table = 'outgoing_email_log';

    protected $guarded = ['id'];

    protected $casts = [
        'id' => 'integer',
    ];

    protected $hidden = ['mime'];

    protected function mime(): Attribute
    {
        return Attribute::make(get: fn(string $value) => utf8_decode($value));
    }

    public static function filterableFields(): array
    {
        return ['id', 'status', 'from', 'to', 'created_at'];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->subject,
            'description' => $this->message_id,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'to' => $this->to,
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
