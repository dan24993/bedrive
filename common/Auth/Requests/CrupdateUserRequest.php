<?php namespace Common\Auth\Requests;

use Common\Core\BaseFormRequest;

class CrupdateUserRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $except = $this->getMethod() === 'PUT' ? $this->route('user')->id : '';

        $rules = [
            'email' => "email|min:3|max:255|unique:users,email,$except",
            'password' => 'min:3|max:255',
            'avatar' => 'string|max:255|nullable',
            'email_verified_at' => '', // can be date string or boolean
            // alpha and space/dash
            'first_name' =>
                'string|min:2|max:255|nullable|regex:/^[\pL\s\-]+$/u',
            'last_name' =>
                'string|min:2|max:255|nullable|regex:/^[\pL\s\-]+$/u',
            'permissions' => 'array',
            'roles' => 'array',
            'roles.*' => 'int',
            'available_space' => 'nullable|min:0',
            'country' => 'nullable|string|max:255',
            'language' => 'nullable|string|max:255',
            'timezone' => 'nullable|string|max:255',
        ];

        if ($this->method() === 'POST') {
            $rules['email'] = 'required|' . $rules['email'];
            $rules['password'] = 'required|' . $rules['password'];
        }

        return $rules;
    }
}
