import {
	Popover,
	Group,
	ColorSwatch,
	Text,
	Tooltip,
	ColorPicker,
	TextInput,
} from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

function BannerTheme(props: any): JSX.Element {
	const initialColor = props.background || '#FFFFFF'; // Default to white if no background color is provided
	const [colorValue, setColorValue] = useState(initialColor);
	const [inputValue, setInputValue] = useState(initialColor);

	useEffect(() => {
		// Update state if props.background changes
		if (props.background) {
			setColorValue(props.background);
			setInputValue(props.background);
		}
	}, [props.background]);

	const handleCustomStyles = (value: string) => {
		setColorValue(value);
		setInputValue(value); // Sync input value with color picker
		props.customStyles(value, props.name);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		// Validate and apply the color value only if it's valid
		if (
			/^#[0-9A-Fa-f]{6}$|^rgba?\((\d{1,3},\s?){2,3}(\d?\.?\d+)?\)$/.test(
				value
			)
		) {
			handleCustomStyles(value);
			props.customStyles(value, props.label);
		}
	};

	return (
		<React.Fragment>
			<Popover trapFocus position="bottom" withArrow shadow="md">
				<Popover.Target>
					<Group mt="xs">
						<ColorSwatch color={colorValue} size={20} />
						<Text size="xs">{props.label}</Text>
						{props.description && (
							<Tooltip label={props.description}>
								<IconInfoCircle size={14} />
							</Tooltip>
						)}
					</Group>
				</Popover.Target>
				<Popover.Dropdown>
					<ColorPicker
						value={colorValue}
						onChange={handleCustomStyles}
					/>
					<TextInput
						mt="sm"
						placeholder="Enter color code"
						value={inputValue}
						onChange={handleInputChange}
						size="xs"
					/>
				</Popover.Dropdown>
			</Popover>
		</React.Fragment>
	);
}

export { BannerTheme };
