<?php

namespace Common\Admin\Appearance\Controllers;

use Common\Core\BaseController;
use Exception;
use Illuminate\Support\Facades\File;

class SeoTagsController extends BaseController
{
    public function show(string $names)
    {
        $this->authorize('update', 'AppearancePolicy');

        $names = explode(',', $names);

        $response = [];

        foreach ($names as $name) {
            try {
                $customView = storage_path(
                    "app/editable-views/seo-tags/$name.blade.php",
                );
                $response[$name] = [
                    'custom' => file_exists($customView)
                        ? file_get_contents($customView)
                        : null,
                    'original' => file_get_contents(
                        resource_path("views/seo/$name/seo-tags.blade.php"),
                    ),
                ];
            } catch (Exception $e) {
                //
            }
        }

        return $this->success($response);
    }

    public function update(string $name)
    {
        $this->authorize('update', 'AppearancePolicy');

        $data = $this->validate(request(), [
            'tags' => 'required|string',
        ]);

        $directory = storage_path('app/editable-views/seo-tags');
        File::ensureDirectoryExists($directory);

        file_put_contents("$directory/$name.blade.php", $data['tags']);

        return $this->success();
    }
}
