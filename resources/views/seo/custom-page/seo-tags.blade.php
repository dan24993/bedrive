<meta property="og:site_name" content="{{ settings('branding.site_name') }}" />
<meta property="twitter:card" content="summary" />
<meta property="og:type" content="website" />
<title>{{ $page->title }} - {{ settings('branding.site_name') }}</title>
<meta
    property="og:title"
    content="{{ $page->title }} - {{ settings('branding.site_name') }}"
/>
<meta property="og:url" content="{{ urls()->customPage($page) }}" />
<link rel="canonical" href="{{ urls()->customPage($page) }}" />

@if ($page->description)
    <meta property="og:description" content="{{ $page->description }}" />
    <meta name="description" content="{{ $page->description }}" />
@endif
