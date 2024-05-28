<?php

namespace App\Workspaces;

use App\Models\FileEntry;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait WorkspaceRelationships
{
    public function entries(): HasMany
    {
        return $this->hasMany(FileEntry::class);
    }
}
