<?php

namespace App\Console\Commands;

use App\Listeners\HydrateUserWithSampleDriveContents;
use App\Models\User;
use Carbon\Carbon;
use Common\Auth\Actions\CreateUser;
use Common\Auth\Events\UserCreated;
use Common\Auth\Permissions\Permission;
use Common\Database\Seeds\DefaultPagesSeeder;
use Common\Files\FileEntry;
use Common\Localizations\Localization;
use Common\Tags\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CleanDemoSite extends Command
{
    protected $signature = 'demoSite:clean';
    protected $description = 'Reset demo site to its initial state';

    public function handle(): int
    {
        FileEntry::whereDate(
            'created_at',
            '<',
            Carbon::now()->subDay(),
        )->chunkById(500, function (Collection $entries) {
            $this->cleanEntries($entries);
        });

        $this->cleanAdminUser('admin@admin.com');
        $this->rehydrateDemoAccounts();
        $this->createTagForStarringEntries();
        DB::table('subscriptions')->truncate();
        DB::table('custom_pages')->truncate();

        // delete localizations
        Localization::get()->each(function (Localization $localization) {
            if (strtolower($localization->name) !== 'english') {
                $localization->delete();
            }
        });

        app(DefaultPagesSeeder::class)->run();

        Artisan::call('cache:clear');

        $this->info('Demo site reset');

        return Command::SUCCESS;
    }

    private function rehydrateDemoAccounts(): void
    {
        User::where('email', 'like', 'admin@demo%')->delete();

        for ($i = 0; $i <= 100; $i++) {
            $num = str_pad($i, 3, '0', STR_PAD_LEFT);
            $user = (new CreateUser())->execute([
                'email' => "admin@demo{$num}.com",
                'password' => 'admin',
            ]);
            $this->cleanAdminUser($user->email);
        }

        // create user for sharing
        User::where('email', 'tester@tester.com')->delete();
        $user = (new CreateUser())->execute([
            'email' => 'tester@tester.com',
            'password' => 'tester',
        ]);
        $this->cleanAdminUser($user);
    }

    private function cleanEntries(Collection $entries): void
    {
        $entries->each(function (FileEntry $entry) {
            $parentAndChildren = $entry->allChildren()->get();
            $parentAndChildren->push($entry);
            $this->removeEntries($parentAndChildren);
        });
    }

    private function removeEntries(Collection $entries): void
    {
        $ids = $entries->pluck('id');

        // detach from users
        DB::table('file_entry_models')
            ->whereIn('file_entry_id', $ids)
            ->delete();

        // detach tags
        DB::table('taggables')
            ->whereIn('taggable_id', $ids)
            ->where('taggable_type', FileEntry::MODEL_TYPE)
            ->delete();

        // delete shareable links
        DB::table('shareable_links')
            ->whereIn('entry_id', $ids)
            ->delete();

        $paths = $entries
            ->filter(fn(FileEntry $entry) => $entry->type !== 'folder')
            ->map(fn(FileEntry $entry) => $entry->file_name);

        // delete files from disk
        foreach ($paths as $path) {
            Storage::disk('uploads')->deleteDirectory($path);
        }

        // delete entries
        DB::table('file_entries')
            ->whereIn('id', $ids)
            ->delete();
    }

    private function cleanAdminUser($email): void
    {
        $admin = User::with('entries')
            ->where('email', $email)
            ->first();

        if (!$admin) {
            return;
        }

        $adminPermission = Permission::where('name', 'admin')->first();

        $admin->avatar = null;
        $admin->username = 'admin';
        $admin->first_name = 'Demo';
        $admin->last_name = 'Admin';
        $admin->password = 'admin';
        $admin->card_last_four = null;
        $admin->card_brand = null;
        $admin->permissions()->sync([$adminPermission->id]);
        $admin->save();

        // delete file entries
        $this->cleanEntries($admin->entries);

        // rehydrate
        app(HydrateUserWithSampleDriveContents::class)->handle(
            new UserCreated($admin, []),
        );
    }

    private function createTagForStarringEntries(): void
    {
        Tag::firstOrCreate([
            'name' => 'starred',
            'display_name' => 'Starred',
            'type' => 'label',
        ]);
    }
}
