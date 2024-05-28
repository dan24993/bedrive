import {List, ListItem} from '@common/ui/list/list';
import {DateRangePresets} from '@common/ui/forms/input-field/date/date-range-picker/dialog/date-range-presets';
import {Trans} from '@common/i18n/trans';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';

interface DateRangePresetList {
  onPresetSelected: (value: DateRangeValue) => void;
  selectedValue?: DateRangeValue | null;
}
export function DatePresetList({
  onPresetSelected,
  selectedValue,
}: DateRangePresetList) {
  return (
    <List>
      {DateRangePresets.map(preset => (
        <ListItem
          borderRadius="rounded-none"
          capitalizeFirst
          key={preset.key}
          isSelected={selectedValue?.preset === preset.key}
          onSelected={() => {
            const newValue = preset.getRangeValue();
            onPresetSelected(newValue);
          }}
        >
          <Trans {...preset.label} />
        </ListItem>
      ))}
    </List>
  );
}
