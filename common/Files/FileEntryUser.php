<?php

namespace Common\Files;

use App\Models\User;
use Common\Auth\BaseUser;

class FileEntryUser extends BaseUser
{
    protected $table = 'users';

    protected bool $billingEnabled = false;

    public function getMorphClass()
    {
        return User::MODEL_TYPE;
    }

    protected $hidden = [
        'password',
        'remember_token',
        'first_name',
        'last_name',
        'has_password',
        'pivot',
    ];

    protected $appends = ['owns_entry', 'entry_permissions', 'display_name'];

    public function getOwnsEntryAttribute()
    {
        return $this->pivot->owner;
    }

    public function getEntryPermissionsAttribute()
    {
        if ($this->pivot->owner) {
            return [
                'edit' => true,
                'view' => true,
                'download' => true,
            ];
        }

        return $this->pivot->permissions;
    }

    public function toArray(bool $showAll = false): array
    {
        return array_merge(
            $this->attributesToArray(),
            $this->relationsToArray(),
        );
    }
}
