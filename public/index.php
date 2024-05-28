<?php

define('LARAVEL_START', microtime(true));

if (version_compare(PHP_VERSION, '8.1') === -1) {
    exit('You need at least PHP ' . '8.1' . ' to install this application.');
}

require __DIR__ . '/../bootstrap/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

if (!file_exists(__DIR__ . '/../.env')) {
    $app->loadEnvironmentFrom('env.example');
}

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle($request = Illuminate\Http\Request::capture());

$response->send();

$kernel->terminate($request, $response);
