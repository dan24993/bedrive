<?php

namespace Common\Files\Actions\Deletion;

use Common\Files\Events\FileEntriesDeleted;
use Common\Files\FileEntry;
use DB;
use Illuminate\Support\Collection;

class PermanentlyDeleteEntries extends SoftDeleteEntries
{
    /**
     * Permanently delete file entries, related records and files from disk.
     */
    protected function delete(Collection|array $entries): void
    {
        $entries = $this->loadChildEntries($entries, true);
        $this->deleteFiles($entries);
        $this->deleteEntries($entries);
        event(new FileEntriesDeleted($entries->pluck('id')->toArray(), true));
    }

    /**
     * Delete file entries from database.
     */
    private function deleteEntries(Collection $entries): void
    {
        $entryIds = $entries->pluck('id');

        // detach users
        DB::table('file_entry_models')
            ->whereIn('file_entry_id', $entryIds)
            ->delete();

        // detach tags
        DB::table('taggables')
            ->where('taggable_type', FileEntry::MODEL_TYPE)
            ->whereIn('taggable_id', $entryIds)
            ->delete();

        $this->entry->whereIn('id', $entries->pluck('id'))->forceDelete();
    }

    /**
     * Delete files from disk.
     */
    private function deleteFiles(Collection $entries): void
    {
        $entries
            ->filter(function (FileEntry $entry) {
                return $entry->type !== 'folder';
            })
            ->each(function (FileEntry $entry) {
                if ($entry->public) {
                    $entry->getDisk()->delete($entry->getStoragePath());
                } else {
                    $entry->getDisk()->deleteDirectory($entry->file_name);
                }
            });
    }
}
