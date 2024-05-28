<?php

namespace App\Http\Controllers;

use Common\Core\BaseController;
use Common\Files\FileEntry;
use Illuminate\Support\Facades\Auth;

class EntrySyncInfoController extends BaseController
{
    public function index()
    {
        $userId = request('userId', Auth::user()->id);
        $this->authorize('index', [FileEntry::class, null, $userId]);

        $data = $this->validate(request(), [
            'entryIds' => 'required|array',
            'entryIds.*' => 'required|int',
        ]);

        $entries = Auth::user()
            ->entries()
            ->withTrashed()
            ->whereIn('file_entries.id', $data['entryIds'])
            ->select(['file_name', 'extension', 'file_entries.id', 'file_size'])
            ->get()
            ->map(fn(FileEntry $entry) => $entry->setAppends(['hash']));

        return $this->success(['entries' => $entries]);
    }
}
