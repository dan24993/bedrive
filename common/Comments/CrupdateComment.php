<?php

namespace Common\Comments;

use App\Models\User;
use Auth;
use Common\Comments\Notifications\CommentReceivedReply;
use Illuminate\Support\Arr;

class CrupdateComment
{
    public function execute(
        array $data,
        Comment $initialComment = null,
    ): Comment {
        if (!$initialComment) {
            $comment = new Comment([
                'user_id' => Auth::id(),
            ]);
        } else {
            $comment = $initialComment;
        }

        $inReplyTo = Arr::get($data, 'inReplyTo');

        // specific app might need to store
        // some extra data along with comment
        $attributes = Arr::except($data, 'inReplyTo');
        if ($inReplyTo) {
            $attributes['parent_id'] = $inReplyTo['id'];
        }

        if (isset($attributes['commentable_type'])) {
            // track => App\Track
            $attributes['commentable_type'] = $data['commentable_type'];
        }
        $comment->fill($attributes)->save();

        $comment->generatePath();

        if (
            !$initialComment &&
            $inReplyTo &&
            $inReplyTo['user']['id'] !== Auth::id()
        ) {
            app(User::class)
                ->find($inReplyTo['user']['id'])
                ->notify(new CommentReceivedReply($comment, $inReplyTo));
        }

        return $comment;
    }
}
