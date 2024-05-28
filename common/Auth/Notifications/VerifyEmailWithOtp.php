<?php

namespace Common\Auth\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class VerifyEmailWithOtp extends Notification
{
    public function __construct(public string $otp)
    {
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $accountSettingsUrl = url('account-settings');
        $pStyle =
            'line-height: 30px; text-align: left; font-weight: normal; font-style: normal; letter-spacing: 0.48px; color: #718096';

        $title = __('Your :site security code is:', [
            'site' => config('app.name'),
        ]);
        $accountSettingsTxt = __('Account settings');

        return (new MailMessage())
            ->subject(
                __('Your :site security code is :code', [
                    'site' => config('app.name'),
                    'code' => $this->otp,
                ]),
            )
            ->greeting(new HtmlString("<h1 style=\"$pStyle\">$title</h1>"))
            ->line(
                new HtmlString(
                    '<b style="font-size: 48px; font-style: normal; font-weight: bold; padding: 20px 0; line-height: 54px; color: #3d4852">' .
                        $this->otp .
                        '</b>',
                ),
            )
            ->line(
                __(
                    'If you did not request this code, please go to your :link and change your password right away.',
                    [
                        'link' => "<a href=\"$accountSettingsUrl\">$accountSettingsTxt</a>",
                    ],
                ),
            )
            ->line(
                __('This code will expire in :minutes minutes.', [
                    'minutes' => 30,
                ]),
            );
    }
}
