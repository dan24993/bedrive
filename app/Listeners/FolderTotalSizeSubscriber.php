<?php

namespace App\Listeners;

use App\Models\FileEntry;
use Common\Files\Events\FileEntriesDeleted;
use Common\Files\Events\FileEntriesMoved;
use Common\Files\Events\FileEntriesRestored;
use Common\Files\Events\FileEntryCreated;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\DB;

class FolderTotalSizeSubscriber
{
    public function onEntryCreated(FileEntryCreated $event): void
    {
        $entry = $event->fileEntry;
        if ($entry->type !== 'folder' && $entry->parent_id) {
            $entry->allParents()->increment('file_size', $entry->file_size);
        }
    }

    public function onEntriesDeletedOrRestored(
        FileEntriesDeleted|FileEntriesRestored $event,
    ): void {
        $entries = FileEntry::withTrashed()
            ->whereIn('id', $event->entryIds)
            ->whereNotNull('parent_id')
            ->get();

        $parentIds = $entries
            ->flatMap(fn(FileEntry $entry) => $entry->getParentIds())
            ->unique();

        $fileSize = $entries->sum('file_size');
        if (is_a($event, FileEntriesDeleted::class)) {
            FileEntry::whereIn('id', $parentIds)
                ->where('file_size', '>', 0)
                ->update([
                    'file_size' => DB::raw(
                        "CASE WHEN file_size > $fileSize THEN file_size - $fileSize ELSE 0 END",
                    ),
                ]);
        } else {
            FileEntry::whereIn('id', $parentIds)->increment(
                'file_size',
                $fileSize,
            );
        }
    }

    public function onEntriesMoved(FileEntriesMoved $event): void
    {
        $movedEntriesSize = FileEntry::whereIn('id', $event->entryIds)->sum(
            'file_size',
        );

        // files could be moved from or to root
        if ($event->destination) {
            FileEntry::where('id', $event->destination)->increment(
                'file_size',
                $movedEntriesSize,
            );
        }
        if ($event->source) {
            FileEntry::where('id', $event->source)->update([
                'file_size' => DB::raw(
                    "CASE WHEN file_size > $movedEntriesSize THEN file_size - $movedEntriesSize ELSE 0 END",
                ),
            ]);
        }
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            FileEntryCreated::class,
            self::class . '@onEntryCreated',
        );

        $events->listen(
            FileEntriesMoved::class,
            self::class . '@onEntriesMoved',
        );

        $events->listen(
            [FileEntriesDeleted::class, FileEntriesRestored::class],
            self::class . '@onEntriesDeletedOrRestored',
        );
    }
}
