<?php

namespace Common\Auth\Events;

use App\Models\User;

class SocialConnected
{
    public function __construct(public User $user, public string $socialName)
    {
    }
}
