<?php

namespace Common\Logging\Schedule;

use Common\Core\BaseModel;

class ScheduleLogItem extends BaseModel
{
    const MODEL_TYPE = 'schedule_log_item';

    protected $table = 'schedule_log';

    protected $guarded = ['id'];

    protected $casts = [
        'id' => 'integer',
        'ran_at' => 'datetime',
        'duration' => 'integer',
        'count_in_last_hour' => 'integer',
        'exit_code' => 'integer',
    ];

    public $timestamps = false;

    public static function scheduleRanInLast30Minutes(): bool
    {
        return (new self())
            ->where('command', ScheduleHealthCommand::class)
            ->whereBetween('ran_at', [now()->subMinutes(30), now()])
            ->exists();
    }

    public static function filterableFields(): array
    {
        return ['id', 'ran_at', 'duration', 'count_in_last_hour', 'exit_code'];
    }

    public function toNormalizedArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->command,
            'description' => $this->output,
            'model_type' => self::MODEL_TYPE,
        ];
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'command' => $this->command,
            'ran_at' => $this->ran_at->timestamp ?? '_null',
        ];
    }

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
