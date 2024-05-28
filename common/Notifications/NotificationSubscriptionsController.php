<?php

namespace Common\Notifications;

use App\Models\User;
use Common\Core\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\File;

class NotificationSubscriptionsController extends BaseController
{
    public function __construct()
    {
        $this->middleware(['auth']);
    }

    public function index(User $user): JsonResponse
    {
        $response = $this->getConfig();

        // filter out notifications user does not have permission for
        $response['subscriptions'] = collect($response['subscriptions'])
            ->map(function ($group) use ($user) {
                $group['subscriptions'] = collect($group['subscriptions'])
                    ->filter(function ($subscription) use ($user) {
                        if (!isset($subscription['permissions'])) {
                            return true;
                        }
                        return collect($subscription['permissions'])->every(
                            fn($permission) => $user->hasPermission(
                                $permission,
                            ),
                        );
                    })
                    ->values()
                    ->toArray();
                return $group;
            })
            ->filter(fn($group) => count($group['subscriptions']))
            ->values()
            ->toArray();

        $subs = $user->notificationSubscriptions;
        $response['user_selections'] = $subs;

        return $this->success($response);
    }

    public function update(User $user): JsonResponse
    {
        $data = $this->validate(request(), [
            'selections' => 'present|array',
            'selections.*.notif_id' => 'required|string',
            'selections.*.channels' => 'required|array',
        ]);

        $allConfig = collect($this->getConfig()['subscriptions'])->flatMap(
            fn($group) => $group['subscriptions'],
        );

        foreach ($data['selections'] as $selection) {
            // check if user has permissions to subscribe to this notification
            $config = $allConfig->firstWhere(
                'notif_id',
                $selection['notif_id'],
            );
            if (isset($config['permissions'])) {
                $hasAllPermissions = collect($config['permissions'])->every(
                    fn($permission) => $user->hasPermission($permission),
                );
                if (!$hasAllPermissions) {
                    return $this->error(
                        'You do not have permission to subscribe to one of these notifications.',
                        [],
                        403,
                    );
                }
            }

            $subscription = $user
                ->notificationSubscriptions()
                ->firstOrNew(['notif_id' => $selection['notif_id']]);
            $newChannels = $subscription['channels'];
            // can update state of all channels at once or only a single channel
            foreach ($selection['channels'] as $newChannel => $isSubscribed) {
                $newChannels[$newChannel] = $isSubscribed;
            }
            $subscription->fill(['channels' => $newChannels])->save();
        }

        return $this->success();
    }

    private function getConfig()
    {
        return File::getRequire(
            resource_path('defaults/notification-settings.php'),
        );
    }
}
