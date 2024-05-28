<?php

namespace Common\Domains\Validation;

use Illuminate\Contracts\Validation\InvokableRule;
use Illuminate\Support\Str;

class HostIsNotBlacklisted implements InvokableRule
{
    public function __invoke($attribute, mixed $value, $fail): void
    {
        $message = __("$value can't be used as a branded domain.");
        $blacklist =
            settings('links.blacklist.domains') ??
            settings('blacklist.domains');
        if ($blacklist) {
            $blacklist = collect(explode(',', $blacklist))->map(
                fn($item) => trim($item),
            );

            if ($blacklist->some(fn($item) => Str::contains($value, $item))) {
                $fail($message);
            }
        }

        if (!(new ValidateLinkWithGoogleSafeBrowsing())->execute($value)) {
            $fail($message);
        }

        if (!(new ValidateLinkWithPhishtank())->execute($value)) {
            $fail($message);
        }
    }
}
