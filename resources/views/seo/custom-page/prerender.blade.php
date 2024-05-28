@extends('common::prerender.base')

@section('head')
    @include('seo.custom-page.seo-tags')
@endsection

@section('body')
    <h1>{{ $page->title }}</h1>

    <main>
        {!! $page->body !!}
    </main>
@endsection
