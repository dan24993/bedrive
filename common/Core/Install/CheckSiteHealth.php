<?php

namespace Common\Core\Install;

class CheckSiteHealth
{
    public function execute(): array
    {
        return $this->performChecks();
    }

    protected function performChecks(): array
    {
        $minPhpVersion = $this->getMinimumPhpversion();
        $results = collect([
            'server' => [
                'items' => [
                    'PHP Version' => [
                        'passes' => version_compare(
                            PHP_VERSION,
                            $minPhpVersion,
                            '>',
                        ),
                        'errorMessage' => "You need at least $minPhpVersion PHP version.",
                    ],
                ],
            ],
            'extensions' => [
                'items' => [
                    'PDO' => [
                        'passes' => defined('PDO::ATTR_DRIVER_NAME'),
                        'errorMessage' =>
                            'PHP PDO extension needs to be enabled.',
                    ],
                    'XML' => [
                        'passes' => extension_loaded('xml'),
                        'errorMessage' =>
                            'PHP XML extension needs to be enabled.',
                    ],
                    'Mbstring' => [
                        'passes' => extension_loaded('mbstring'),
                        'errorMessage' =>
                            'PHP mbstring extension needs to be enabled.',
                    ],
                    'Fileinfo' => [
                        'passes' => extension_loaded('fileinfo'),
                        'errorMessage' =>
                            'PHP fileinfo extension needs to be enabled.',
                    ],
                    'OpenSSL' => [
                        'passes' => extension_loaded('openssl'),
                        'errorMessage' =>
                            'PHP openssl extension needs to be enabled.',
                    ],
                    'GD' => [
                        'passes' => extension_loaded('gd'),
                        'errorMessage' =>
                            'PHP GD extension needs to be enabled.',
                    ],
                    'Curl' => [
                        'passes' => extension_loaded('curl'),
                        'errorMessage' =>
                            'PHP curl extension needs to be enabled.',
                    ],
                    'Zip' => [
                        'passes' => class_exists('ZipArchive'),
                        'errorMessage' =>
                            'PHP ZipArchive extension needs to be installed.',
                    ],
                    'fpassthru' => [
                        'passes' => function_exists('fpassthru'),
                        'errorMessage' =>
                            '"fpassthru" PHP function needs to be enabled.',
                    ],
                ],
            ],
            'filesystem' => $this->checkFilesystemPermissions(),
        ])->toArray();

        $someFailed = false;
        foreach ($results as $groupName => $group) {
            $results[$groupName]['allPassed'] = collect($group['items'])->every(
                'passes',
            );
            if (!$results[$groupName]['allPassed']) {
                $someFailed = true;
            }
        }

        return [
            'results' => $results,
            'allPassed' => !$someFailed,
        ];
    }

    protected function checkFilesystemPermissions(): array
    {
        $basePath = base_path();
        return [
            'items' => collect([
                '.htaccess',
                'public/.htaccess',
                config('common.site.installed') ? '.env' : 'env.example',
                'storage',
                'storage/app',
                'storage/logs',
                'storage/framework',
                'public/storage',
            ])
                ->map(function ($directory) use ($basePath) {
                    $path = rtrim("$basePath/$directory", '/');
                    if (is_file($path)) {
                        if (!is_writable($path)) {
                            @chmod($path, 0664);
                        }
                        return [
                            'path' => $path,
                            'passes' =>
                                is_writable($path) && filesize($path) > 0,
                            'errorMessage' => "Make sure <strong>$path</strong> has been uploaded properly and is writable (0664 permission).",
                        ];
                    } else {
                        if (!is_writable($path)) {
                            @chmod($path, 0775);
                        }
                        return [
                            'path' => $path,
                            'passes' => is_writable($path),
                            'errorMessage' => "Make <strong>$path</strong> writable by giving it 0775 or 0777 permissions via file manager.",
                        ];
                    }
                })
                ->toArray(),
        ];
    }

    protected function getMinimumPhpversion(): string
    {
        $composer = json_decode(
            file_get_contents(base_path('composer.json')),
            true,
        );
        preg_match('/(\d+\.\d+\.\d+)/', $composer['require']['php'], $matches);
        return $matches[1] ?? '8.1';
    }
}
