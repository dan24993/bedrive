<?php

namespace Common\Billing\Invoices;

use Common\Billing\Subscription;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'id' => 'integer',
        'subscription_id' => 'integer',
        'paid' => 'boolean',
    ];

    const MODEL_TYPE = 'invoice';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
