<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShareableLink extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'user_id' => 'integer',
        'entry_id' => 'integer',
        'id' => 'integer',
        'allow_download' => 'boolean',
        'allow_edit' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function entry(): BelongsTo
    {
        return $this->belongsTo(FileEntry::class);
    }

    public function setPasswordAttribute(?string $value)
    {
        $this->attributes['password'] = $value ? bcrypt($value) : null;
    }
}
