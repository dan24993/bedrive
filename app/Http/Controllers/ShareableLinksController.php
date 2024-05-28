<?php

namespace App\Http\Controllers;

use App\Http\Requests\CrupdateShareableLinkRequest;
use App\Models\FileEntry;
use App\Models\ShareableLink;
use App\Services\Links\CrupdateShareableLink;
use App\Services\Links\GetShareableLink;
use App\Services\Links\ValidatesLinkPassword;
use Common\Core\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShareableLinksController extends BaseController
{
    use ValidatesLinkPassword;

    public function __construct(
        private Request $request,
        private ShareableLink $link,
    ) {
    }

    public function show(int|string $idOrHash)
    {
        $data = app(GetShareableLink::class)->execute(
            $idOrHash,
            request('loader', 'shareableLinkPage'),
            $this->request->all(),
        );

        $link = $data['link'];
        if (!$link || !$link->entry || $link->entry->trashed()) {
            if (isApiRequest()) {
                return $this->success(['link' => null]);
            } else {
                abort(404);
            }
        }

        $data['passwordInvalid'] = !$this->passwordIsValid($link);

        $this->authorize('show', $link);

        return $this->renderClientOrApi([
            'data' => $data,
            'pageName' => 'shareable-link-page',
            'noSSR' => true,
        ]);
    }

    public function store(
        int $entryId,
        CrupdateShareableLinkRequest $request,
        CrupdateShareableLink $action,
    ) {
        $this->authorize('create', ShareableLink::class);
        $this->authorize('update', [FileEntry::class, [$entryId]]);

        $params = $request->all();
        $params['userId'] = $request->user()->id;
        $params['entryId'] = $entryId;

        $existingLink = $this->link->where('entry_id', $entryId)->first();
        $link = $existingLink ?: $action->execute($params);

        return $this->success(['link' => $link]);
    }

    public function update(
        int $entryId,
        CrupdateShareableLinkRequest $request,
        CrupdateShareableLink $action,
    ): JsonResponse {
        $link = $this->link->where('entry_id', $entryId)->firstOrFail();

        $this->authorize('update', $link);

        $params = $request->all();
        $params['userId'] = $request->user()->id;

        $action->execute($params, $link);

        return $this->success(['link' => $link]);
    }

    public function destroy(int $entryId): JsonResponse
    {
        $link = $this->link->where('entry_id', $entryId)->firstOrFail();

        $this->authorize('destroy', $link);

        $link->delete();

        return $this->success();
    }
}
