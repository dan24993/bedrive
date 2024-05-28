<?php namespace Common\Settings;

use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class Settings
{
    protected Collection $all;

    /**
     * Laravel config values that should be included with settings.
     * (display name for client => laravel config key)
     */
    protected array $configKeys = [
        'billing.stripe_public_key' => 'services.stripe.key',
        'billing.paypal.public_key' => 'services.paypal.client_id',
        'site.demo' => 'common.site.demo',
        'logging.sentry_public' => 'sentry.dsn',
        'i18n.default_localization' => 'app.locale',
        'billing.integrated' => 'common.site.billing_integrated',
        'workspaces.integrated' => 'common.site.workspaces_integrated',
        'notifications.integrated' => 'common.site.notifications_integrated',
        'notif.subs.integrated' => 'common.site.notif_subs_integrated',
        'api.integrated' => 'common.site.api_integrated',
        'branding.site_name' => 'app.name',
        'realtime.pusher_cluster' =>
            'broadcasting.connections.pusher.options.cluster',
        'realtime.pusher_key' => 'broadcasting.connections.pusher.key',
        'site.hide_docs_buttons' => 'common.site.hide_docs_buttons',
        'site.has_mobile_app' => 'common.site.has_mobile_app',
        'uploads.public_driver' => 'common.site.public_disk_driver',
        'uploads.uploads_driver' => 'common.site.uploads_disk_driver',
        'uploads.disable_tus' => 'common.site.uploads_disable_tus',
    ];

    /**
     * Settings that are json encoded in database.
     */
    public static array $jsonKeys = [
        'menus',
        'homepage.appearance',
        'uploads.allowed_extensions',
        'uploads.blocked_extensions',
        'cookie_notice.button',
        'registration.policies',
        'artistPage.tabs',
        'landing',
        'hc.newTicket.appearance',
        'incoming_email',
        'title_page.sections',
        'streaming.qualities',
        'builder.template_categories',
        'publish.default_credentials',
    ];

    public static array $secretKeys = [
        'recaptcha.secret_key',
        'google_safe_browsing_key',
        'incoming_email',
    ];

    public function __construct()
    {
        $this->loadSettings();
    }

    public function all(bool $includeSecret = false): array
    {
        $all = $this->all;

        // filter out secret (server-only) settings
        if (!$includeSecret) {
            $all = $all->filter(function ($value, $key) use ($includeSecret) {
                return !in_array($key, self::$secretKeys);
            });
        }

        return $all->toArray();
    }

    public function get(string|int $key, mixed $default = null): mixed
    {
        $value = Arr::get($this->all, $key) ?? $default;

        return is_string($value) ? trim($value) : $value;
    }

    /**
     * Get random setting value from fields that
     * have multiple values separated by newline.
     */
    public function getRandom(string $key, ?string $default = null): mixed
    {
        $key = $this->get($key, $default);
        $parts = explode("\n", $key);
        return $parts[array_rand($parts)];
    }

    public function getMenu(string $name)
    {
        return Arr::first(
            $this->get('menus'),
            fn($menu) => strtolower($menu['name']) === strtolower($name),
        );
    }

    public function has(string $key): bool
    {
        return !is_null(Arr::get($this->all, $key));
    }

    /**
     * Set single setting. Does not persist in database.
     */
    public function set(string $key, mixed $value): void
    {
        $this->all[$key] = $value;
    }

    /**
     * Persist specified settings in database.
     */
    public function save(array $settings): void
    {
        $settings = $this->flatten($settings);

        foreach ($settings as $key => $value) {
            $setting = Setting::firstOrNew(['name' => $key]);
            $setting->value = $value;
            $setting->save();
            $this->set($key, $setting->value);
        }

        Cache::forget('settings.public');
    }

    /**
     * Get all settings parsed from dot notation to assoc array. Also decodes JSON values.
     */
    public function getUnflattened(
        bool $includeSecret = false,
        array $settings = null,
    ): array {
        if (!$settings) {
            $settings = $this->all($includeSecret);
        }

        foreach ($settings as $key => $value) {
            if (in_array($key, self::$jsonKeys) && is_string($value)) {
                $settings[$key] = json_decode($value, true);
            }
        }

        $dot = dot($settings, true);

        return $dot->all();
    }

    /**
     * Flatten specified assoc array into dot array. (['billing.enable' => true])
     */
    public function flatten(array $settings): array
    {
        // this will find all json keys, encode them and remove decoded version from original array
        foreach (Settings::$jsonKeys as $key) {
            if (Arr::has($settings, $key)) {
                $value = Arr::pull($settings, $key);
                $settings[$key] = is_array($value)
                    ? json_encode($value)
                    : $value;
            }
        }

        $dot = dot($settings);

        // remove keys that were added from config files and are not stored in database
        $dotArray = $dot->delete(array_keys($this->configKeys))->flatten();

        // dot package leaves empty array as value for root element when deleting
        foreach ($dotArray as $key => $value) {
            if (is_array($value) && empty($value)) {
                unset($dotArray[$key]);
            }
        }

        return $dotArray;
    }

    protected function find(string $key)
    {
        return Arr::get($this->all, $key);
    }

    protected function loadSettings(): void
    {
        $value = Cache::get('settings.public');
        $this->all = collect();

        if ($value && count($value) > 0) {
            $this->all = $value;
        } else {
            try {
                $value = Setting::select('name', 'value')
                    ->get()
                    ->pluck('value', 'name');
                if (!$value->isEmpty()) {
                    $this->all = $value;
                    Cache::set('settings.public', $value, now()->addDay());
                }
            } catch (Exception $e) {
            }
        }

        // add config keys that should be included
        foreach ($this->configKeys as $clientKey => $configKey) {
            $this->set($clientKey, config()->get($configKey));
        }
    }
}
