<?php

namespace Common\Auth;

use Illuminate\Database\Eloquent\Model;

class OtpCode extends Model
{
    const TYPE_EMAIL_VERIFICATION = 'email_verification';

    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public $timestamps = false;

    public function isExpired(): bool
    {
        return now()->gte($this->expires_at);
    }

    public static function createForEmailVerification(int $userId)
    {
        self::where('user_id', $userId)
            ->where('type', static::TYPE_EMAIL_VERIFICATION)
            ->delete();
        return static::create([
            'user_id' => $userId,
            'type' => static::TYPE_EMAIL_VERIFICATION,
            'code' => random_int(100000, 999999),
            'expires_at' => now()->addMinutes(30),
        ]);
    }
}
