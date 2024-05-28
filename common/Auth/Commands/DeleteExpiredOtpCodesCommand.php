<?php

namespace Common\Auth\Commands;

use Common\Auth\OtpCode;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class DeleteExpiredOtpCodesCommand extends Command
{
    protected $signature = 'otp:deleteExpired';
    protected $description = 'Delete one time passwords that have expired.';

    public function handle(): int
    {
        OtpCode::query()
            ->where('expires_at', '<', Carbon::now())
            ->delete();

        $this->info('Expired OTP codes have been deleted.');

        return Command::SUCCESS;
    }
}
