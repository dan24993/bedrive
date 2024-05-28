<?php

namespace Common\Admin\Appearance\Themes;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class CrupdateCssTheme
{
    public function execute(array $data, CssTheme $cssTheme = null): ?CssTheme
    {
        if (!$cssTheme) {
            $cssTheme = CssTheme::newInstance([
                'user_id' => Auth::id(),
                'values' => $data['is_dark']
                    ? config('common.themes.dark')
                    : config('common.themes.light'),
            ]);
        }

        $attributes = Arr::only($data, [
            'name',
            'is_dark',
            'default_dark',
            'default_light',
            'values',
        ]);

        $cssTheme->fill($attributes)->save();

        return $cssTheme;
    }
}
