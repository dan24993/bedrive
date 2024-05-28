<x-install-layout>
    <p class="mb-24">Enter credentials for the super admin account.</p>

    @if($errors->hasAny())
        <div class="bg-danger p-10 mb-20 rounded-md text-white ">
            <div class="font-semibold mb-6">There was an issue. This is the error message:</div>
            <div class="text-sm">{{$errors->first()}}</div>
        </div>
    @endif

    <form action="{{ url('install/admin/validate') }}" method="post" class="w-full">
        @csrf
        <div class="mb-20">
            <label for="email" class="block mb-4 text-sm">Admin email</label>
            <input type="text" name="email" id="email" class="block py-8 px-12 border rounded shadow w-full" value="{{ old('email') }}" required>
            @if($errors->has('email'))
                <div class="text-danger text-sm mt-4">{{$errors->get('email')[0]}}</div>
            @endif
        </div>
        <div class="mb-20">
            <label for="password" class="block mb-4 text-sm">Admin password</label>
            <input type="password" name="password" id="password" class="block py-8 px-12 border rounded shadow w-full" value="{{ old('password') }}" required>
            @if($errors->has('password'))
                <div class="text-danger text-sm mt-4">{{$errors->get('password')[0]}}</div>
            @endif
        </div>
        <div class="mb-20">
            <label for="password_confirmation" class="block mb-4 text-sm">Confirm password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" class="block py-8 px-12 border rounded shadow w-full" value="{{ old('password_confirmation') }}" required>
            @if($errors->has('password_confirmation'))
                <div class="text-danger text-sm mt-4">{{$errors->get('password_confirmation')[0]}}</div>
            @endif
        </div>
        <x-install-button>Continue</x-install-button>
    </form>
</x-install-layout>
