<x-install-layout>
    <p class="mb-24 text-lg">Installation has been successfully completed!</p>

    <div class="flex items-start gap-24 justify-between mb-24">
        <div>
            <div class="font-semibold mb-4">Website address</div>
            <div class="mb-4">Your website is located at this URL:</div>
            <p><a class="text-primary underline" href="{{$url}}">{{$url}}</a></p>
        </div>

        <div class="col">
            <h4 class="font-semibold mb-4">Administration area</h4>
            <div class="mb-4">Use the following link to log into the administration area:</div>
            <p><a class="text-primary underline" href={{"$url/admin"}}>{{"$url/admin"}}</a></p>
        </div>
    </div>

    <div>
        <h4>Support and questions</h4>
        <div>If you have any issues or questions please submit a ticket <a class="text-primary underline" target="_blank" href="https://support.vebto.com">here</a>. Thanks!</div>
    </div>

    <x-install-button href="/">Done</x-install-button>
</x-install-layout>
