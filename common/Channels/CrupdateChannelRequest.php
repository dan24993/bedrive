<?php

namespace Common\Channels;

use Common\Core\BaseFormRequest;
use Illuminate\Validation\Rule;

class CrupdateChannelRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $required = $this->getMethod() === 'POST' ? 'required' : '';
        $ignore = $this->getMethod() === 'PUT' ? $this->route('channel')->id : '';

        return [
            'name' => [
                $required, 'string', 'min:3', 'max:100',
                Rule::unique('channels')->ignore($ignore)
            ],
            'description' => 'nullable|string|max:500',
            'public' => 'boolean',
            'content.data' => 'array',
            'config' => 'array',
            'type' => 'string',
            'config.autoUpdateMethod' => 'required_if:config.contentType,autoUpdate'
        ];
    }

    public function messages()
    {
        return [
            'config.autoUpdateMethod' => __('Auto update method is required.'),
        ];
    }
}
