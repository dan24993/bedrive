@if($attributes->has('href'))
    <a href="{{ $attributes->get('href') }}" type="submit" class="mt-24 block w-max py-8 px-16 bg-primary font-semibold text-on-primary rounded shadow active:bg-primary-dark focus:ring">{{$slot}}</a>
@else
    <button type="submit" class="mt-24 block w-max py-8 px-16 bg-primary font-semibold text-on-primary rounded shadow active:bg-primary-dark focus:ring">{{$slot}}</button>
@endif
