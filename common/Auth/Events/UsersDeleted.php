<?php

namespace Common\Auth\Events;

use Illuminate\Database\Eloquent\Collection;

class UsersDeleted
{
    public Collection $users;

    public function __construct(Collection $users)
    {
        $this->users = $users;
    }
}
