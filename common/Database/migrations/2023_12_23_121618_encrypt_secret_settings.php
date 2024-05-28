<?php

use Common\Settings\Setting;
use Common\Settings\Settings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        foreach (Settings::$secretKeys as $key) {
            $setting = Setting::where('name', $key)->first();
            if ($setting) {
                $setting->value = encrypt($setting->getRawOriginal('value'));
                $setting->save();
            }
        }
    }

    public function down(): void
    {
        //
    }
};
