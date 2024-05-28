<?php

namespace Common\Admin\Appearance\Themes;

use Illuminate\Database\Eloquent\Model;

class CssTheme extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'is_dark' => 'boolean',
        'default_dark' => 'boolean',
        'default_light' => 'boolean',
        'font' => 'json',
    ];

    const MODEL_TYPE = 'css_theme';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }

    public function setValuesAttribute($value)
    {
        if ($value && is_array($value)) {
            $this->attributes['values'] = json_encode($value);
        }
    }

    public function getValuesAttribute($value): array
    {
        if ($value && is_string($value)) {
            return json_decode($value, true);
        } else {
            return [];
        }
    }

    public function getCssVariables(): string
    {
        // don't decode from json
        $values = $this->attributes['values'] ?? '';
        $values = preg_replace('/"/', '', $values);
        $values = preg_replace('/\\\/', '', $values);
        $values = preg_replace('/[{}]/', '', $values);
        $values = preg_replace('/, ?--/', ';--', $values);
        if ($family = $this->getFontFamily()) {
            $values .= ";--be-font-family: $family";
        }
        return $values;
    }

    public function getFontFamily(): string|null
    {
        return $this->font['family'] ?? null;
    }

    public function isGoogleFont(): bool
    {
        return $this->font['google'] ?? false;
    }

    public function getHtmlThemeColor()
    {
        if ($this->is_dark) {
            return $this->values['--be-background-alt'];
        } else {
            return $this->values['--be-primary'];
        }
    }
}
