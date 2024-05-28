<?php

namespace Common\Domains;

use App\Models\User;
use Common\Core\BaseModel;
use Common\Workspaces\Traits\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CustomDomain extends BaseModel
{
    use HasFactory, BelongsToWorkspace;

    protected $guarded = ['id'];
    const MODEL_TYPE = 'customDomain';

    protected $casts = [
        'id' => 'integer',
        'global' => 'boolean',
        'resource_id' => 'int',
    ];

    protected $appends = ['model_type'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resource(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Limit query to only custom domains specified user has access to.
     */
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query
            ->leftJoin(
                'workspace_user',
                'workspace_user.workspace_id',
                '=',
                'custom_domains.workspace_id',
            )
            ->where($query->qualifyColumn('user_id'), $userId)
            ->orWhere($query->qualifyColumn('global'), true)
            ->orWhere('workspace_user.user_id', $userId);
    }

    public function getHostAttribute(?string $value): ?string
    {
        return parse_url($value, PHP_URL_SCHEME) === null
            ? "https://$value"
            : $value;
    }

    public function setHostAttribute(string $value)
    {
        $this->attributes['host'] = trim($value, '/');
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->host,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'host' => $this->host,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
            'global' => $this->global,
            'workspace_id' => $this->workspace_id ?? '_null',
        ];
    }

    public static function filterableFields(): array
    {
        return [
            'id',
            'user_id',
            'created_at',
            'updated_at',
            'global',
            'workspace_id',
        ];
    }

    protected static function newFactory(): CustomDomainFactory
    {
        return CustomDomainFactory::new();
    }

    public static function getModelTypeAttribute(): string
    {
        return static::MODEL_TYPE;
    }
}
