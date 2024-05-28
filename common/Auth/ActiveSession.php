<?php

namespace Common\Auth;

use Illuminate\Database\Eloquent\Model;

class ActiveSession extends Model
{
    protected $guarded = ['id'];

    const MODEL_TYPE = 'active_session';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
