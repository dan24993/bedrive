@extends('common::prerender.base')

@section('head')
    @include('seo.landing-page.seo-tags')
@endsection

@section('body')
    @if ($data = settings('homepage.appearance'))
        <h1>{{ $data['headerTitle'] }}</h1>
        <p>{{ $data['headerSubtitle'] }}</p>

        @foreach ($data['actions'] as $action)
            @if (isset($action['action']))
                <a href="{{ $action['action'] }}">{{ $action['label'] }}</a>
            @endif
        @endforeach

        @if (isset($data['primaryFeatures']))
            <ul>
                @foreach ($data['primaryFeatures'] as $primaryFeature)
                    <li>
                        <h2>{{ $primaryFeature['title'] }}</h2>
                        <p>{{ $primaryFeature['subtitle'] }}</p>
                    </li>
                @endforeach
            </ul>
        @endif

        @if (isset($data['secondaryFeatures']))
            <ul>
                @foreach ($data['secondaryFeatures'] as $secondaryFeature)
                    <li>
                        <h3>{{ $secondaryFeature['title'] }}</h3>
                        @if (isset($secondaryFeature['subtitle']))
                            <small>{{ $secondaryFeature['subtitle'] }}</small>
                        @endif

                        <p>{{ $secondaryFeature['description'] }}</p>
                    </li>
                @endforeach
            </ul>
        @endif

        @if (isset($data['footerTitle']))
            <footer>
                <div>{{ $data['footerTitle'] }}</div>
                <p>{{ $data['footerSubtitle'] }}</p>
            </footer>
        @endif
    @endif
@endsection
