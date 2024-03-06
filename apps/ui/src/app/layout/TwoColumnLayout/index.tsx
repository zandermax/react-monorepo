import { Col, Row } from 'antd';

const TwoColumnLayout = ({
	children,
	classNames,
}: {
	children: JSX.Element[];
	classNames?: string;
}) => {
	return (
		<Row className={classNames}>
			{children.map((child, index) => (
				<Col
					key={index}
					xs={22}
					sm={22}
					md={{ span: 22, offset: 1 }}
					lg={{ span: 11, offset: 1 }}
					xl={{ span: 10, offset: 1 }}
				>
					{child}
				</Col>
			))}
		</Row>
	);
};

export default TwoColumnLayout;
