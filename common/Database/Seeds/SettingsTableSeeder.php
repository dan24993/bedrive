<?php namespace Common\Database\Seeds;

use Carbon\Carbon;
use Common\Settings\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SettingsTableSeeder extends Seeder
{
    public function __construct(protected Setting $setting)
    {
    }

    public function run()
    {
        $defaultSettings = config('common.default-settings');

        $names = [];

        $defaultSettings = array_map(function ($setting) use (&$names) {
            $names[] = $setting['name'];

            $setting['created_at'] = Carbon::now();
            $setting['updated_at'] = Carbon::now();

            //make sure all settings have "private" field to
            //avoid db errors due to different column count
            if (!array_key_exists('private', $setting)) {
                $setting['private'] = 0;
            }

            // cast booleans to string as "insert"
            // method will not use Setting model setters
            if ($setting['value'] === true) {
                $setting['value'] = 'true';
            } elseif ($setting['value'] === false) {
                $setting['value'] = 'false';
            }
            $setting['value'] = (string) $setting['value'];

            // add ids to menus and menu items, if don't have one already
            if ($setting['name'] === 'menus') {
                $value = json_decode($setting['value'], true);
                foreach ($value as &$menu) {
                    if (!isset($menu['id'])) {
                        $menu['id'] = Str::random(6);
                    }
                    foreach ($menu['items'] as &$item) {
                        if (!isset($item['id'])) {
                            $item['id'] = Str::random(6);
                        }
                    }
                }
                $setting['value'] = json_encode($value);
            }

            return $setting;
        }, $defaultSettings);

        $existing = $this->setting->whereIn('name', $names)->pluck('name');

        //only insert settings that don't already exist in database
        $new = array_filter($defaultSettings, function ($setting) use (
            $existing,
        ) {
            return !$existing->contains($setting['name']);
        });

        $this->setting->insert($new);

        $this->mergeMenusSetting($defaultSettings);
    }

    /**
     * Merge existing menus setting json with new one.
     */
    private function mergeMenusSetting(array $defaultSettings): void
    {
        $existing =
            $this->setting->where('name', 'menus')->first()->value ?? [];
        $new = json_decode(
            Arr::first(
                $defaultSettings,
                fn($value) => $value['name'] === 'menus',
            )['value'],
            true,
        );

        foreach ($new as $newMenu) {
            $alreadyHas = Arr::first(
                $existing,
                fn($value) => $value['name'] === $newMenu['name'],
            );

            foreach ($newMenu['items'] as $index => $item) {
                $newMenu['items'][$index]['order'] = $index;
            }

            if (!$alreadyHas) {
                $existing[] = $newMenu;
            }
        }

        $this->setting
            ->where('name', 'menus')
            ->update(['value' => json_encode($existing)]);
    }
}
