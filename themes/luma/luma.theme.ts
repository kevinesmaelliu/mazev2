// The luma theme. `astryx experimental theme editor` wrote this file once and never changes it again.
// The checked settings live in luma.settings.json and the generated luma.settings.ts;
// change them with `astryx experimental theme editor set luma ...`. Add your own changes below: they win over the settings.
import {defineTheme} from '@astryxdesign/core/theme';
import {lumaSettings} from './luma.settings';

export const lumaTheme = defineTheme({
  extends: lumaSettings,
  name: 'luma',
});
