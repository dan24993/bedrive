<?php namespace Common\Database\Seeds;

use App\Models\User;
use Common\Admin\Appearance\Themes\CssTheme;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class CssThemesTableSeeder extends Seeder
{
    public function run(): void
    {
        $dark = config('common.themes.dark');
        $light = config('common.themes.light');

        $admin = User::whereHas('permissions', function (Builder $builder) {
            $builder->where('name', 'admin');
        })->first();

        $darkTheme = CssTheme::where('default_dark', true)
            ->orWhere('name', 'Dark')
            ->first();
        if (!$darkTheme || !$darkTheme->getRawOriginal('values')) {
            if ($darkTheme) {
                $darkTheme->delete();
            }
            CssTheme::create([
                'name' => 'Dark',
                'is_dark' => true,
                'default_dark' => true,
                'values' => $dark,
                'user_id' => $admin ? $admin->id : 1,
            ]);
        }

        $lightTheme = CssTheme::where('default_light', true)
            ->orWhere('name', 'Light')
            ->first();
        if (!$lightTheme || !$lightTheme->getRawOriginal('values')) {
            if ($lightTheme) {
                $lightTheme->delete();
            }
            CssTheme::create([
                'name' => 'Light',
                'default_light' => true,
                'user_id' => $admin ? $admin->id : 1,
                'values' => $light,
            ]);
        }
    }
}
