<?php

namespace Common\Auth\Events;

use App\Models\User;

class UserCreated
{
    public function __construct(public User $user, public array $data)
    {
    }
}
