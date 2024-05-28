<meta property="og:site_name" content="{{ settings('branding.site_name') }}" />
<meta property="twitter:card" content="summary" />
<meta property="og:type" content="website" />
<title>{{ $link->entry->name }} - {{ settings('branding.site_name') }}</title>
<meta
    property="og:title"
    content="{{ $link->entry->name }} - {{ settings('branding.site_name') }}"
/>
<meta property="og:url" content="{{ urls()->home() }}" />
<link rel="canonical" href="{{ urls()->home() }}" />

<meta
    property="og:description"
    content="Shared with {{ settings('branding.site_name') }}"
/>
<meta
    name="description"
    content="Shared with {{ settings('branding.site_name') }}"
/>
