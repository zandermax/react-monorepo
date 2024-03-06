import { Button, Collapse, CollapseProps, Space } from 'antd';
import ErrorThrower from './ErrorThrower';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

export type EnhancedFeaturesProps = {
	onAddAllToFavorites: () => void;
	onRemoveAllFromFavorites: () => void;
	setError: (message: string) => void;
};

const EnhancedFeatures: React.FC<EnhancedFeaturesProps> = ({
	onAddAllToFavorites,
	onRemoveAllFromFavorites,
	setError,
}) => {
	const items: CollapseProps['items'] = [
		{
			key: '1',
			label: 'Click for super-cool secret features!',
			children: (
				<Space direction="vertical">
					<div style={{ display: 'flex', flexFlow: 'column' }}>
						<Space direction="vertical">
							<Button
								onClick={() => {
									onAddAllToFavorites();
								}}
							>
								<PlusOutlined />
								Add all in list to favorites
							</Button>
							<Button onClick={() => onRemoveAllFromFavorites()}>
								<MinusOutlined />
								Unfavorite all in list
							</Button>
						</Space>
					</div>
					<ErrorThrower setError={setError} />
				</Space>
			),
		},
	];

	return (
		<section>
			<Collapse size="small" items={items} />
		</section>
	);
};

export default EnhancedFeatures;
