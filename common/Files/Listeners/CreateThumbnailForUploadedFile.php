<?php

namespace Common\Files\Listeners;

use Common\Files\Events\FileUploaded;
use Common\Files\FileEntry;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class CreateThumbnailForUploadedFile implements ShouldQueue
{
    public function handle(FileUploaded $event): void
    {
        // only create thumbnail for images over 500KB in size
        if (
            !$event->fileEntry->public &&
            $event->fileEntry->type === 'image' &&
            $event->fileEntry->file_size > 500000 &&
            !config('common.site.disable_thumbnail_creation')
        ) {
            try {
                $this->maybeCreateThumbnail($event->fileEntry);
            } catch (Exception $e) {
                //
            }
        }
    }

    private function maybeCreateThumbnail(FileEntry $entry): void
    {
        $this->setMemoryLimit();
        $file = $entry->getDisk()->readStream($entry->getStoragePath());

        $manager = new ImageManager(new Driver());
        $img = $manager->read($file);

        $img->cover(350, 250);

        $encodedImg =
            $entry->extension === 'png' ? $img->toPng() : $img->toJpeg(60);

        $entry
            ->getDisk()
            ->put("{$entry->file_name}/thumbnail.jpg", $encodedImg, [
                'mimetype' => $encodedImg->mimetype(),
                'visibility' => config('common.site.remote_file_visibility'),
            ]);

        $entry->fill(['thumbnail' => true])->save();
    }

    private function setMemoryLimit(): void
    {
        $new = 512;
        $current = (int) ini_get('memory_limit');
        if ($current < $new) {
            @ini_set('memory_limit', "{$new}M");
        }
    }
}
