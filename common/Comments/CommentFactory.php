<?php

namespace Common\Comments;

use App\Models\User;
use Arr;
use Common\Auth\Roles\Role;
use Common\Billing\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'content' => $this->faker->realText(),
            'commentable_type' => Arr::random([
                User::MODEL_TYPE,
                Product::MODEL_TYPE,
                Role::MODEL_TYPE,
            ]),
            'commentable_id' => Arr::random([1, 2, 3, 4, 5]),
            'user_id' => Arr::random([1, 2, 3, 4, 5]),
            'parent_id' => Arr::random([1, null]),
        ];
    }
}
