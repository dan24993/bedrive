<?php

namespace App\Policies;

use App\Models\ShareableLink;
use App\Models\User;
use App\Services\Links\ValidatesLinkPassword;
use Common\Core\Policies\BasePolicy;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShareableLinkPolicy extends BasePolicy
{
    use HandlesAuthorization, ValidatesLinkPassword;

    public function show(User $user, ShareableLink $link)
    {
        if ($link->user_id === $user->id) {
            return true;
        }

        return $this->hasPermission($user, 'links.view') &&
            // will handle password on the client, it will be actually
            // checked on the server when requesting file preview
            (requestIsFromFrontend() || $this->passwordIsValid($link));
    }

    public function create(User $user)
    {
        return $this->hasPermission($user, 'links.create');
    }

    public function update(User $user, ShareableLink $link)
    {
        return $this->hasPermission($user, 'links.update') ||
            $link->user_id === $user->id;
    }

    public function destroy(User $user, ShareableLink $link)
    {
        return $this->hasPermission($user, 'links.delete') ||
            $link->user_id === $user->id;
    }
}
