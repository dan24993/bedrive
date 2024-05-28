<?php
$cssVariables = collect(config('common.themes.light'))
    ->mapWithKeys(fn($value, $key) => [$key => $value])
    ->map(fn($value, $key) => "$key: $value;")
    ->implode('');
$buttonClass = 'py-8 px-16 bg-primary font-semibold text-on-primary rounded shadow active:bg-primary-dark focus:ring';
?>

<!DOCTYPE html>
<html style="{{$cssVariables}}">
<head>
    <title>Install</title>
    @vite('resources/client/main.css')
</head>
<body class="bg-alt flex flex-col items-center justify-center text-main">
<img src="{{ asset('images/logo-dark.png') }}" alt="Logo" class="h-40 mb-34" />
<div class="w-780 p-24 rounded-md bg shadow border">
    {{$slot}}
</div>
</body>
</html>

