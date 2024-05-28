<?php

use Illuminate\Database\Migrations\Migration;
use Symfony\Component\Console\Output\ConsoleOutput;

return new class extends Migration {
    public function up()
    {
        $models = [
            'App\\BuilderPage',
            'App\\Project',
            'App\\ProjectSetting',
            'App\\Models\\Album',
            'App\\Models\\Artist',
            'App\\Models\\ArtistBio',
            'App\\Models\\BackstageRequest',
            'App\\Models\\Channel',
            'App\\Models\\Genre',
            'App\\Models\\Like',
            'App\\Models\\Lyric',
            'App\\Models\\Playlist',
            'App\\Models\\ProfileImage',
            'App\\Models\\ProfileLink',
            'App\\Models\\Repost',
            'App\\Models\\Tag',
            'App\\Models\\Track',
            'App\\Models\\TrackPlay',
            'App\\Models\\User',
            'App\\Models\\UserProfile',
            'App\\Models\\Action',
            'App\\Models\\Activity',
            'App\\Models\\Article',
            'App\\Models\\ArticleFeedback',
            'App\\Models\\ArticleRole',
            'App\\Models\\CannedReply',
            'App\\Models\\Category',
            'App\\Models\\Condition',
            'App\\Models\\Email',
            'App\\Models\\Operator',
            'App\\Models\\PurchaseCode',
            'App\\Models\\Reply',
            'App\\Models\\SearchTerm',
            'App\\Models\\Tag',
            'App\\Models\\Ticket',
            'App\\Models\\Trigger',
            'App\\Models\\UserDetails',
            'App\\Models\\Biolink',
            'App\\Models\\BiolinkAppearance',
            'App\\Models\\BiolinkLink',
            'App\\Models\\BiolinkPivot',
            'App\\Models\\BiolinkWidget',
            'App\\Models\\Link',
            'App\\Models\\LinkDomain',
            'App\\Models\\LinkGroup',
            'App\\Models\\LinkImage',
            'App\\Models\\LinkOverlay',
            'App\\Models\\LinkPage',
            'App\\Models\\LinkeableClick',
            'App\\Models\\LinkeableRule',
            'App\\Models\\TrackingPixel',
            'App\\Models\\FcmToken',
            'App\\Models\\File',
            'App\\Models\\FileEntry',
            'App\\Models\\Folder',
            'App\\Models\\RootFolder',
            'App\\Models\\ShareableLink',
            'App\\Models\\User',
            'App\\Models\\Channel',
            'App\\Models\\Episode',
            'App\\Models\\Genre',
            'App\\Models\\Image',
            'App\\Models\\Keyword',
            'App\\Models\\Listable',
            'App\\Models\\Movie',
            'App\\Models\\NewsArticle',
            'App\\Models\\Person',
            'App\\Models\\ProductionCountry',
            'App\\Models\\ProfileLink',
            'App\\Models\\Review',
            'App\\Models\\ReviewFeedback',
            'App\\Models\\ReviewReport',
            'App\\Models\\Season',
            'App\\Models\\Series',
            'App\\Models\\Title',
            'App\\Models\\UserProfile',
            'App\\Models\\Video',
            'App\\Models\\VideoCaption',
            'App\\Models\\VideoPlay',
            'App\\Models\\VideoReport',
            'App\\Models\\VideoVote',
            'Common\\Admin\\Appearance\\Themes\\CssTheme',
            'Common\\Auth\\ActiveSession',
            'Common\\Auth\\Ban',
            'Common\\Auth\\Permissions\\Permission',
            'Common\\Auth\\Roles\\Role',
            'Common\\Auth\\SocialProfile',
            'Common\\Billing\\Invoices\\Invoice',
            'Common\\Billing\\Models\\Price',
            'Common\\Billing\\Models\\Product',
            'Common\\Billing\\Subscription',
            'Common\\Comments\\Comment',
            'Common\\Comments\\CommentReport',
            'Common\\Comments\\CommentVote',
            'Common\\Csv\\CsvExport',
            'Common\\Domains\\CustomDomain',
            'Common\\Files\\FileEntry',
            'Common\\Files\\FileEntryPivot',
            'Common\\Files\\FileEntryUser',
            'Common\\Localizations\\Localization',
            'Common\\Notifications\\NotificationSubscription',
            'Common\\Pages\\CustomPage',
            'Common\\Settings\\Setting',
            'Common\\Tags\\Tag',
            'Common\\Votes\\Vote',
        ];

        $tables = [
            'permissionables' => 'permissionable_type',
            'comments' => 'commentable_type',
            'custom_domains' => 'resource_type',
            'file_entry_models' => 'model_type',
            'taggables' => 'taggable_type',
            'link_clicks' => 'linkeable_type',
            'linkeable_rules' => 'linkeable_type',
            'channelables' => 'channelable_type',
            'creditables' => 'creditable_type',
            'listables' => 'listable_type',
            'genreables' => 'genreable_type',
            'activity_log' => 'subject_type',
            'bans' => ['bannable_type', 'created_by_type'],
            'images' => 'model_type',
            'news_article_models' => 'model_type',
            'notifications' => 'notifiable_type',
            'personal_access_tokens' => 'tokenable_type',
            'profile_links' => 'linkeable_type',
            'reviews' => 'reviewable_type',
            'likes' => 'likeable_type',
            'reposts' => 'repostable_type',
        ];

        $output = new ConsoleOutput();

        foreach ($tables as $table => $_column) {
            if (Schema::hasTable($table)) {
                $columns = is_array($_column) ? $_column : [$_column];
                foreach ($columns as $column) {
                    foreach ($models as $model) {
                        $output->write(
                            "Updating $table.$column to $model",
                            true,
                        );
                        try {
                            $constant_reflex = new ReflectionClassConstant(
                                $model,
                                'MODEL_TYPE',
                            );
                            $modelType = $constant_reflex->getValue();
                        } catch (ReflectionException $e) {
                            $modelType = null;
                        }

                        $model = trim($model, '\\');

                        if ($modelType) {
                            $base = DB::table($table)->where(function (
                                $builder,
                            ) use ($column, $model) {
                                $builder
                                    ->where($column, $model)
                                    ->orWhere(
                                        $column,
                                        str_replace(
                                            'App\Models',
                                            'App',
                                            $model,
                                        ),
                                    );
                            });

                            $hasId =
                                Schema::hasColumn($table, 'id') &&
                                $table !== 'notifications';
                            $lastId = $hasId ? $base->clone()->max('id') : null;

                            if (ctype_digit($lastId)) {
                                $lastId = (int) $lastId;
                            } else {
                                $lastId = 10000;
                            }

                            // update 10000 rows at a time
                            for ($i = 0; $i < $lastId; $i += 10000) {
                                $base
                                    ->clone()
                                    ->when($hasId, function ($builder) use (
                                        $i,
                                    ) {
                                        $builder
                                            ->where('id', '>', $i)
                                            ->where('id', '<=', $i + 10000);
                                    })
                                    ->update([$column => $modelType]);
                            }
                        }
                    }
                }
            }
        }
    }

    public function down()
    {
    }
};
