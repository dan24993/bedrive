<?php namespace Common\Auth\Roles;

use App\Models\User;
use Common\Auth\Permissions\Traits\HasPermissionsRelation;
use Common\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends BaseModel
{
    use HasPermissionsRelation;

    const MODEL_TYPE = 'role';

    protected $guarded = ['id'];

    protected $hidden = ['pivot', 'legacy_permissions'];

    protected $casts = [
        'id' => 'integer',
        'default' => 'boolean',
        'guests' => 'boolean',
        'internal' => 'boolean',
    ];

    /**
     * Get default role for assigning to new users.
     */
    public function getDefaultRole(): ?Role
    {
        return $this->where('default', 1)->first();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_role')->withPivot(
            'created_at',
        );
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
            'description' => $this->description,
            'type' => $this->type,
            'created_at' => $this->created_at->timestamp ?? '_null',
            'updated_at' => $this->updated_at->timestamp ?? '_null',
        ];
    }

    public static function filterableFields(): array
    {
        return ['id', 'type', 'created_at', 'updated_at'];
    }

    public static function getModelTypeAttribute(): string
    {
        return Role::MODEL_TYPE;
    }
}
