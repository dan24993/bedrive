<?php

namespace Common\Auth\Actions;

use App\Models\User;
use Common\Auth\ActiveSession;
use Common\Auth\Ban;
use Common\Auth\Events\UsersDeleted;
use Common\Billing\Subscription;
use Common\Csv\CsvExport;
use Common\Domains\Actions\DeleteCustomDomains;
use Common\Domains\CustomDomain;
use Common\Files\Actions\Deletion\PermanentlyDeleteEntries;
use Common\Pages\CustomPage;

class DeleteUsers
{
    public function execute(array $ids): int
    {
        $users = User::whereIn('id', $ids)->get();

        $users->each(function (User $user) {
            $user->social_profiles()->delete();
            $user->roles()->detach();
            $user->notifications()->delete();
            $user->permissions()->detach();

            if ($user->subscribed()) {
                $user->subscriptions->each(function (
                    Subscription $subscription,
                ) {
                    $subscription->cancelAndDelete();
                });
            }

            $user->delete();

            $entryIds = $user
                ->entries(['owner' => true])
                ->pluck('file_entries.id');
            app(PermanentlyDeleteEntries::class)->execute($entryIds);
        });

        // delete domains
        $domainIds = app(CustomDomain::class)
            ->whereIn('user_id', $ids)
            ->pluck('id');
        app(DeleteCustomDomains::class)->execute($domainIds->toArray());

        // delete custom pages
        CustomPage::whereIn('user_id', $ids)->delete();

        // delete sessions
        ActiveSession::whereIn('user_id', $ids)->delete();

        // csv exports
        CsvExport::whereIn('user_id', $ids)->delete();

        // bans
        Ban::where('bannable_type', User::MODEL_TYPE)
            ->whereIn('bannable_id', $ids)
            ->delete();

        event(new UsersDeleted($users));

        return $users->count();
    }
}
