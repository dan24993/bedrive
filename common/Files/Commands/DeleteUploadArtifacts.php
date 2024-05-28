<?php

namespace Common\Files\Commands;

use Common\Files\Actions\Deletion\PermanentlyDeleteEntries;
use Common\Files\FileEntry;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DeleteUploadArtifacts extends Command
{
    protected $signature = 'uploads:clean';
    protected $description = 'Delete uploaded files that are no longer used.';

    protected array $map = [
        'branding_media' => [
            'type' => 'settings',
            'keys' => [
                'branding.logo_light',
                'branding.logo_dark',
                'branding.logo_light_mobile',
                'branding.logo_dark_mobile',
            ],
        ],
        'homepage_media' => [
            'type' => 'settings',
            'keys' => ['homepage.appearance'],
        ],
        'page_media' => [
            'type' => 'model',
            'table' => 'custom_pages',
            'column' => 'body',
        ],

        // mtdb
        'person-posters' => [
            'type' => 'model',
            'table' => 'people',
            'column' => 'poster',
        ],
        'episode-posters' => [
            'type' => 'model',
            'table' => 'episodes',
            'column' => 'poster',
        ],
        'title-posters' => [
            'type' => 'model',
            'table' => 'titles',
            'column' => 'poster',
        ],
        'title-backdrops' => [
            'type' => 'model',
            'table' => 'titles',
            'column' => 'backdrop',
        ],
        'title-videos' => [
            'type' => 'model',
            'table' => 'videos',
            'column' => 'src',
        ],
        'video-thumbnails' => [
            'type' => 'model',
            'table' => 'videos',
            'column' => 'thumbnail',
        ],

        // bemusic
        'track_image_media' => [
            'type' => 'model',
            'table' => 'tracks',
            'column' => 'image',
        ],
        'album_media' => [
            'type' => 'model',
            'table' => 'albums',
            'column' => 'image',
        ],
        'track_media' => [
            'type' => 'model',
            'table' => 'tracks',
            'column' => 'src',
        ],
        'artist_media' => [
            'type' => 'model',
            'table' => 'artists',
            'column' => 'image_small',
        ],
        'genre_media' => [
            'type' => 'model',
            'table' => 'genres',
            'column' => 'image',
        ],
        'playlist_media' => [
            'type' => 'model',
            'table' => 'playlists',
            'column' => 'image',
        ],

        // bedesk
        'ticket_images' => [
            'type' => 'model',
            'table' => 'replies',
            'column' => 'body',
        ],
        'category_images' => [
            'type' => 'model',
            'table' => 'categories',
            'column' => 'image',
        ],
        'article_images' => [
            'type' => 'model',
            'table' => 'articles',
            'column' => 'body',
        ],

        // belink
        'link_overlay_images' => [
            'type' => 'model',
            'table' => 'link_overlays',
            'column' => 'colors',
        ],
    ];

    public function handle(): int
    {
        $storage = Storage::disk('public');
        $count = 0;
        foreach ($this->map as $folder => $config) {
            if ($storage->exists($folder)) {
                $fileNames = collect($storage->allFiles($folder))
                    ->filter(fn($path) => $this->shouldDelete($path, $config))
                    ->map(fn($path) => basename($path));
                $count += $fileNames->count();
                $entryIds = FileEntry::whereIn('file_name', $fileNames)->pluck(
                    'id',
                );
                app(PermanentlyDeleteEntries::class)->execute($entryIds);
            }
        }

        $this->info("Deleted $count unused files.");

        return Command::SUCCESS;
    }

    protected function shouldDelete(string $path, array $config): bool
    {
        if ($config['type'] === 'settings') {
            return collect($config['keys'])
                ->map(fn($key) => settings($key))
                ->filter(
                    fn($configValue) => Str::contains(
                        $configValue,
                        basename($path),
                    ),
                )
                ->isEmpty();
        } elseif ($config['type'] === 'model') {
            if (Schema::hasTable($config['table'])) {
                $fileName = basename($path);
                return DB::table($config['table'])
                    ->whereNotNull($config['column'])
                    ->where($config['column'], 'like', "%$fileName%")
                    ->count() === 0;
            }
        }
    }
}
