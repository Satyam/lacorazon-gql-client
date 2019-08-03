import * as FormComponents from './';

describe('Form', () => {
  it('Should export all components', () => {
    expect(Object.keys(FormComponents).sort()).toEqual(
      [
        'TextField',
        'DateField',
        'CheckboxField',
        'DropdownField',
        'SubmitButton',
        'LabeledCheckbox',
        'LabeledText',
        'Form',
      ].sort()
    );
  });
});
