<x-install-layout>
    <p class="mb-24">Below you should enter your database connection details. If you're not sure about these, contact your hosting provider.</p>

    @if($errors->has('database'))
        <div class="bg-danger p-10 mb-20 rounded-md text-white ">
            <div class="font-semibold mb-6">There was an issue. This is the error message:</div>
            <div class="text-sm">{{$errors->get('database')[0]}}</div>
        </div>
    @endif

    <form action="{{ url('install/database/validate') }}" method="post" class="w-full">
        @csrf
        <div class="mb-20">
            <label for="host" class="block mb-4 text-sm">Database host</label>
            <input type="text" name="host" id="host" class="block py-8 px-12 border rounded shadow w-full" value="{{ $host ?? 'localhost' }}" required>
        </div>
        <div class="mb-20">
            <label for="database" class="block mb-4 text-sm">Database name</label>
            <input type="text" name="database" id="database" class="block py-8 px-12 border rounded shadow w-full" value="{{ $database ?? 'database' }}" required>
        </div>
        <div class="mb-20">
            <label for="username" class="block mb-4 text-sm">Database username</label>
            <input type="text" name="username" id="username" class="block py-8 px-12 border rounded shadow w-full" value="{{ $username ?? 'root' }}" required>
        </div>
        <div class="mb-20">
            <label for="password" class="block mb-4 text-sm">Database password</label>
            <input type="password" name="password" id="password" class="block py-8 px-12 border rounded shadow w-full" value="{{ $password ?? '' }}">
        </div>
        <div class="mb-20">
            <label for="port" class="block mb-4 text-sm">Database port</label>
            <input type="text" name="port" id="port" class="block py-8 px-12 border rounded shadow w-full" value="{{ $port ?? '3306' }}" placeholder="Optional">
        </div>
        <div class="mb-20">
            <label for="prefix" class="block mb-4 text-sm">Database prefix</label>
            <input type="text" name="prefix" id="prefix" class="block py-8 px-12 border rounded shadow w-full" value="{{ $prefix ?? '' }}" placeholder="Optional">
        </div>

        <x-install-button>Continue</x-install-button>
    </form>
</x-install-layout>
