import * as React from 'react';
import { message as Message, Icon, Button } from 'antd';

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { BackgroundSectionProps } from './backgroundSectionDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getWorldviewGivenNovel } from '../../../../db/operations/background-ops';

const BackgroundSection = (props: BackgroundSectionProps) => {
	const { novel_id, isEdit } = props;

	// hooks
	const [worldview, setWorldview] = React.useState<string>('');
	React.useEffect(getWorldview, [props.novel_id]);

	// get world view
	function getWorldview() {
		getWorldviewGivenNovel(novel_id)
			.then((result: any) => {
				// datavalues might be null here
				if (result) setWorldview(result.dataValues.content);
				else setWorldview('暂时还没有世界观设定...');
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	return (
		<div style={{ position: 'relative' }}>
			{
				isEdit && (
					<div className="background-edit-cover">无法直接编辑世界观</div>
				)
			}
			<div className="background-property">
				{worldview}
			</div>
			<Button
				type="primary"
				className="green-button borderless-button"
				style={{ marginLeft: 15, marginTop: 20 }}
				onClick={() => { props.history.push(`/background/${novel_id}`); }}
				ghost
			>
				查看更多设定 <Icon type="arrow-right" />
			</Button>
		</div>
	);
};

export default withRouter(BackgroundSection);
