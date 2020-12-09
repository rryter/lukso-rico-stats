import { ButtonComponent } from './button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      declarations: [ButtonComponent],
      imports: [
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTooltipModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
};

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  component: ButtonComponent,
  props: args,
  argTypes: {
    action: { action: 'action' },
  },
});

export const Base = Template.bind({});
Base.args = {
  text: 'Save',
  disabled: false,
  loading: {
    status: false,
    text: 'Whooot',
  },
};
export const Loading = Template.bind({});
Loading.args = {
  ...Base.args,
  loading: {
    status: true,
    text: 'Loading',
  },
};
