<?php namespace Common\Settings;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = ['name', 'value'];

    protected $casts = ['private' => 'bool'];

    protected function value(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (
                    in_array($this->attributes['name'], Settings::$secretKeys)
                ) {
                    try {
                        $value = decrypt($value);
                    } catch (Exception $e) {
                        $value = '';
                    }
                }

                if (in_array($this->attributes['name'], Settings::$jsonKeys)) {
                    $value = json_decode($value, true);
                }

                if ($value === 'false') {
                    return false;
                }

                if ($value === 'true') {
                    return true;
                }

                if (ctype_digit($value)) {
                    return (int) $value;
                }

                return $value;
            },
            set: function ($value) {
                $value = !is_null($value) ? $value : '';

                if (
                    in_array($this->attributes['name'], Settings::$jsonKeys) &&
                    !is_string($value)
                ) {
                    $value = json_encode($value);
                }

                if ($value === true) {
                    $value = 'true';
                } elseif ($value === false) {
                    $value = 'false';
                }

                $value = (string) $value;

                if (
                    in_array($this->attributes['name'], Settings::$secretKeys)
                ) {
                    $value = encrypt($value);
                }

                return $value;
            },
        );
    }
}
