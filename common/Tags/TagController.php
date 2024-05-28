<?php

namespace Common\Tags;

use App\Models\Tag as AppTag;
use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use DB;

class TagController extends BaseController
{
    public function index()
    {
        $this->authorize('index', Tag::class);

        $builder = $this->getModel()->newQuery();

        if ($type = request('type')) {
            $builder->where('type', $type);
        }

        if ($notType = request('notType')) {
            $builder->where('type', '!=', $notType);
        }

        // don't show "label" tags in bedrive
        $builder->where('type', '!=', 'label');

        $dataSource = new Datasource($builder, request()->all());

        $pagination = $dataSource->paginate();

        return $this->success(['pagination' => $pagination]);
    }

    public function store()
    {
        $this->authorize('store', Tag::class);

        $this->validate(request(), [
            'name' => 'required|string|min:2|unique:tags',
            'display_name' => 'string|min:2',
            'type' => 'required|string|min:2',
        ]);

        $tag = $this->getModel()->create([
            'name' => request('name'),
            'display_name' => request('display_name'),
            'type' => request('type'),
        ]);

        return $this->success(['tag' => $tag]);
    }

    public function update(int $tagId)
    {
        $this->authorize('update', Tag::class);

        $this->validate(request(), [
            'name' => "string|min:2|unique:tags,name,$tagId",
            'display_name' => 'string|min:2',
            'type' => 'string|min:2',
        ]);

        $tag = $this->getModel()->findOrFail($tagId);

        $tag->fill(request()->all())->save();

        return $this->success(['tag' => $tag]);
    }

    public function destroy(string $ids)
    {
        $tagIds = explode(',', $ids);
        $this->authorize('destroy', [Tag::class, $tagIds]);

        $this->getModel()
            ->whereIn('id', $tagIds)
            ->delete();
        DB::table('taggables')
            ->whereIn('tag_id', $tagIds)
            ->delete();

        return $this->success();
    }

    protected function getModel(): Tag
    {
        return app(class_exists(AppTag::class) ? AppTag::class : Tag::class);
    }
}
