import {useFormContext} from 'react-hook-form';
import {FormSelect, Option} from '@common/ui/forms/select/select';
import {Trans} from '@common/i18n/trans';
import {UpdateChannelPayload} from '@common/admin/channels/requests/use-update-channel';
import React from 'react';
import {ChannelContentConfig} from '@common/admin/channels/channel-editor/channel-content-config';

interface Props {
  config: ChannelContentConfig;
  className?: string;
  exclude?: string[];
}
export function ContentModelField({config, className, exclude}: Props) {
  const {setValue, getValues} = useFormContext<UpdateChannelPayload>();
  return (
    <FormSelect
      className={className}
      selectionMode="single"
      name="config.contentModel"
      label={<Trans message="Type of content" />}
      onSelectionChange={newValue => {
        const modelConfig = config.models[newValue];
        if (
          getValues('config.contentType') === 'autoUpdate' &&
          !modelConfig.autoUpdateMethods?.length
        ) {
          (setValue as any)('config.contentType', 'manual');
        }
        setValue('config.autoUpdateMethod', modelConfig.autoUpdateMethods?.[0]);
        setValue(
          'config.contentOrder',
          modelConfig.sortMethods[0] || 'channelables.order:asc',
        );
        setValue('config.layout', modelConfig.layoutMethods[0]);
      }}
    >
      {Object.entries(config.models)
        .filter(([model]) => !exclude?.includes(model))
        .map(([model, {label}]) => (
          <Option value={model} key={model}>
            <Trans {...label} />
          </Option>
        ))}
    </FormSelect>
  );
}
