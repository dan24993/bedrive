<?php

namespace App\Services\Shares;

use App\Models\User;
use App\Services\Shares\Traits\CreatesUserEntryPivotRecords;
use App\Services\Shares\Traits\GeneratesSharePermissions;
use Common\Files\Traits\LoadsAllChildEntries;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class AttachUsersToEntry
{
    use CreatesUserEntryPivotRecords,
        GeneratesSharePermissions,
        LoadsAllChildEntries;

    public function execute(
        array $emails,
        array $entries,
        array $permissions,
    ): Collection {
        $entryIds = collect($entries);

        // permissions on each user are expected
        $users = User::whereIn('email', $emails)->get();

        $transformedUsers = $users->map(
            fn(User $user) => [
                'id' => $user->id,
                'permissions' => $this->generateSharePermissions($permissions),
            ],
        );

        $records = $this->createPivotRecords($transformedUsers, $entryIds);

        $records
            ->chunk(1000)
            ->each(
                fn($chunk) => DB::table('file_entry_models')->insert(
                    $chunk->toArray(),
                ),
            );

        return $users;
    }
}
