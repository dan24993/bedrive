<?php

namespace App\Http\Controllers;

use App\Models\FileEntry;
use App\Services\Entries\SetPermissionsOnEntry;
use Auth;
use Common\Core\BaseController;
use Common\Files\Actions\GetUserSpaceUsage;
use Common\Files\Actions\ValidateFileUpload;
use Common\Files\Events\FileEntryCreated;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Str;

class DuplicateEntriesController extends BaseController
{
    public function __construct(
        private Request $request,
        private FileEntry $entry,
    ) {
    }

    public function duplicate()
    {
        $setPermissions = app(SetPermissionsOnEntry::class);
        $destinationId = (int) request('destinationId');
        $entryIds = request('entryIds');

        if ($destinationId === 0) {
            $destinationId = null;
        }

        $this->validate($this->request, [
            'entryIds' => 'required|array',
            'entryIds.*' => 'required|integer',
            'destinationId' =>
                'exclude_if:destinationId,0|nullable|integer|exists:file_entries,id',
        ]);

        $this->authorize('index', [FileEntry::class, $entryIds]);

        $totalBytes = $this->entry->whereIn('id', $entryIds)->sum('file_size');
        $usage = app(GetUserSpaceUsage::class);
        if (!$usage->hasEnoughSpaceToUpload($totalBytes)) {
            return $this->error(ValidateFileUpload::notEnoughSpaceMessage());
        }

        $copies = $this->copyEntries($entryIds, $destinationId);

        $copies = $copies->map(
            fn(FileEntry $entry) => $setPermissions->execute($entry),
        );

        return $this->success(['entries' => $copies]);
    }

    private function copyEntries(
        array|Collection $entryIds,
        int $parentId = null,
    ) {
        $copies = collect();

        foreach (
            $this->entry
                ->with('owner')
                ->whereIn('id', $entryIds)
                ->cursor()
            as $entry
        ) {
            if ($entry->type === 'folder') {
                $copies[] = $this->copyFolderEntry($entry, $parentId);
            } else {
                $copies[] = $this->copyFileEntry($entry, $parentId);
            }
        }

        return $copies;
    }

    private function copyFileEntry(
        FileEntry $original,
        int $parentId = null,
    ): FileEntry {
        $copy = $this->copyModel($original, $parentId);
        $this->copyFile($original, $copy);

        event(new FileEntryCreated($copy));

        return $copy;
    }

    private function copyFolderEntry(FileEntry $original, int $parentId = null)
    {
        $copy = $this->copyModel($original, $parentId);
        $this->copyChildEntries($copy, $original);

        return $copy;
    }

    private function copyChildEntries(FileEntry $copy, FileEntry $original)
    {
        $entryIds = $this->entry
            ->where('parent_id', $original->id)
            ->pluck('id');

        if (!$entryIds->isEmpty()) {
            $this->copyEntries($entryIds, $copy->id);
        }
    }

    private function copyModel(FileEntry $original, int $parentId = null)
    {
        $newName = $original->name;
        $newOwnerId = $this->getCopyOwnerId();
        $copyingIntoSameDrive = $newOwnerId === $original->owner_id;

        // if we are copying into same folder, add " - Copy" to the end of copies names
        if ($parentId === $original->parent_id && $copyingIntoSameDrive) {
            $newName = "$original->name - " . __('Copy');
        }

        $copy = $original->replicate();
        $copy->name = $newName;
        $copy->path = null;
        $copy->file_name = Str::random(36);
        $copy->parent_id = $parentId;
        $copy->owner_id = $newOwnerId;
        $copy->save();

        $copy->generatePath();

        // set owner
        $copy->users()->attach($newOwnerId, ['owner' => true]);

        $copy->load('users');

        return $copy;
    }

    private function copyFile(FileEntry $original, FileEntry $copy)
    {
        $paths = $original->getDisk()->files($original->file_name);
        foreach ($paths as $path) {
            $newPath = str_replace(
                $original->file_name,
                $copy->file_name,
                $path,
            );
            $original->getDisk()->copy($path, $newPath);
        }
    }

    /**
     * Get user to which entry copies should be attached.
     *
     * @return int
     */
    private function getCopyOwnerId()
    {
        return Auth::user()->id;
    }
}
