<x-install-layout>
    @if($allPassed)
        <p class="mb-24">Your server meets all the requirements. Click continue button below to proceed with the update.</p>
    @else
        <p class="mb-24">We've found some issues that need to be fixed before you can proceed with the update.</p>
    @endif
    @foreach($results as $groupName => $group)
        <div class="border-b py-12">
            <div class="flex items-center justify-between gap-24">
                <div class="capitalize">{{$groupName}}</div>
                @if($group['allPassed'])
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#22c55e"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                @else
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ef4444"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                @endif
            </div>
            @if(!$group['allPassed'])
                @foreach($group['items'] as $item)
                    @if(!$item['passes'])
                        <p class="text-sm text-danger mt-10">{{$item['errorMessage']}}</p>
                    @endif
                @endforeach
            @endif
        </div>
    @endforeach
    <x-install-button
        :href="$allPassed ? url('update/perform') : url('update')"
    >{{ $allPassed ? 'Continue' : 'Check again' }}</x-install-button>
</x-install-layout>
