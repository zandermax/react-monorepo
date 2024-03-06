import { theme, ColorPickerProps, ColorPicker } from 'antd';
import {
	generate,
	green,
	presetPalettes,
	red,
	cyan,
	yellow,
} from '@ant-design/colors';

type Presets = Required<ColorPickerProps>['presets'][number];

const genPresets = (presets = presetPalettes) =>
	Object.entries(presets).map<Presets>(([label, colors]) => ({
		label,
		colors,
	}));

const PlayerColorPicker = ({
	currentColor,
	onColorSelected,
}: {
	currentColor?: ColorPickerProps['defaultValue'];
	onColorSelected?: ColorPickerProps['onChangeComplete'];
} = {}) => {
	const { token } = theme.useToken();

	const presets = genPresets({
		primary: generate(token.colorPrimary),
		red,
		green,
		cyan,
		yellow,
	});

	return (
		<ColorPicker
			defaultValue={currentColor ?? token.colorPrimary}
			presets={presets}
			onChangeComplete={onColorSelected}
		/>
	);
};

export default PlayerColorPicker;
