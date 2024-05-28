<?php

namespace Common\Comments;

use Common\Votes\Vote;

class CommentVote extends Vote
{
    const MODEL_TYPE = 'comment_vote';

    public static function getModelTypeAttribute(): string
    {
        return self::MODEL_TYPE;
    }
}
