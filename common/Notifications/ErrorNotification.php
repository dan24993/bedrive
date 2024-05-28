<?php

namespace Common\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Arr;

class ErrorNotification extends Notification
{
    use Queueable;

    /**
     * @var array
     */
    private $config;

    /**
     * @param array $config
     */
    public function __construct($config)
    {
        $this->config = $config;
    }

    /**
     * @param  User  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * @param  User  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $config = $this->config;
        if ( ! Arr::get($config, 'image')) {
            $config['image'] = 'error-outline';
        }
        return $config;
    }
}
