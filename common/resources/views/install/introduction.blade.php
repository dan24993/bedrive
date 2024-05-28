<x-install-layout>
    <p class="mb-24">Welcome to the {{config('app.name')}}. Before getting started, we need some information on the database. You will need to know the following items before proceeding.</p>
    <ol class="mb-24 list-decimal list-inside">
        <li>Database host</li>
        <li>Database name</li>
        <li>Database username</li>
        <li>Database password</li>
    </ol>
    <p class="mb-24">Most likely these items were supplied to you by your Web Host. If you don’t have this information, then you will need to contact them before you can continue.</p>
    <p>Installer will insert this information inside a configuration file so your site can communicate with your database.</p>
    <p>Need more help? <a class="text-primary underline hover:text-primary-dark" href="https://support.vebto.com/hc/articles/35/37/34/installation" target="_blank">See installation guide.</a></p>
    <x-install-button :href="url('install/requirements')">Continue</x-install-button>
</x-install-layout>
