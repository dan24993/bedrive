<?php namespace Common\Auth;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class SocialProfile extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'access_expires_at' => 'datetime',
    ];

    const MODEL_TYPE = 'social_profile';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
