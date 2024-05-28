<?php

namespace Common\Billing\Models;

use Common\Auth\Permissions\Traits\HasPermissionsRelation;
use Common\Billing\Subscription;
use Common\Core\BaseModel;
use Common\Files\Traits\SetsAvailableSpaceAttribute;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends BaseModel
{
    use HasFactory,
        HasPermissionsRelation,
        SetsAvailableSpaceAttribute;

    protected $guarded = ['id'];

    protected $casts = [
        'free' => 'bool',
        'recommended' => 'bool',
        'position' => 'int',
        'available_space' => 'float',
        'hidden' => 'boolean',
    ];

    public const MODEL_TYPE = 'product';

    protected function featureList(): Attribute
    {
        return Attribute::make(
            get: function ($value): array {
                if ($value) {
                    return (array) json_decode($value);
                }
                return [];
            },
            set: function ($value): string|null {
                if (is_array($value)) {
                    return $this->attributes['feature_list'] = json_encode(
                        $value,
                    );
                } else {
                    return $this->attributes['feature_list'] = $value;
                }
            },
        );
    }

    public function prices(): HasMany
    {
        return $this->hasMany(Price::class)
            ->orderBy('default')
            ->orderBy('amount');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'product_id');
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'feature_list' => implode(', ', $this->feature_list),
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public static function filterableFields(): array
    {
        return ['id', 'created_at', 'updated_at'];
    }

    public static function getModelTypeAttribute(): string
    {
       return static::MODEL_TYPE;
    }
}
