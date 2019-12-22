import * as React from 'react';
import { Row, Col, message as Message, Icon, PageHeader, Button, Tooltip, Input } from 'antd';
import classnames from 'classnames';
const { TextArea } = Input;

// enable history
import { withRouter } from 'react-router-dom';

// type declaration
import { BackgroundProps, BackgroundState, Background as BackgroundDec, BackgroundDataValue } from './backgroundDec';
import { DatabaseError } from 'sequelize';

// database operations
import { getBackgroundsGivenNovel, createAndUpdateBackgrounds } from '../../../db/operations/background-ops';

// utils
import { ctrlsPress } from '../../utils/utils';
import { backgroundIllustrations } from '../../utils/constants';

// sass
import './background.scss';

class BackgroundEdit extends React.Component<BackgroundProps, BackgroundState> {
	constructor(props: BackgroundProps) {
		super(props);
		this.state = {
			novel_id: this.props.match.params.id,
			backgrounds: []
		};
	}

	componentDidMount = () => {
		// add event listener for save shortcut
		document.addEventListener('keydown', this.onSavePress);

		this.setBackground();
	}

	componentWillUnmount = () => {
		// remove event listener
		document.removeEventListener('keydown', this.onSavePress);
	}

	// when save shortcut is presses
	onSavePress = (e: KeyboardEvent) => {
		ctrlsPress(e, this.onSave);
	}

	// when input field changes
	onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title: string = e.target.value;
	}

	// when textarea changes
	onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const title: string = e.target.name;
		const content: string = e.target.value;

		/**
		 * if title is null/undefined, then current content should not appear in the list
		 * therefore, only need to concat with no title specified
		 */
		if (!title) {
			this.setState((prevState: BackgroundState) => ({
				...prevState,
				backgrounds: prevState.backgrounds.concat({ content, title: '', id: -1 }),
				created: true
			}));
			return;
		}

		// set a flag to mark whether current array contains this property
		let contain = false;
		const backgrounds: BackgroundDec[] = this.state.backgrounds.map((background: BackgroundDec) => {
			if (background.title === title) {
				background.content = content;
				contain = true;
				background.updated = true;
			}
			return background;
		});

		// if contains, directly update, otherwise push then update
		if (contain) {
			this.setState({ backgrounds });
		} else {
			this.setState((prevState: BackgroundState) => ({
				...prevState,
				backgrounds: prevState.backgrounds.concat({ title, content, id: -1, created: true })
			}));
		}
	}

	onSave = () => {
		createAndUpdateBackgrounds(this.state.novel_id, this.state.backgrounds)
			.then(() => {
				Message.success('更新成功！');
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	setBackground = () => {
		getBackgroundsGivenNovel(this.state.novel_id)
			.then((result: any) => {
				const backgrounds: BackgroundDec[] = result.map(({ dataValues }: { dataValues: BackgroundDataValue }) => {
					return { id: dataValues.id, title: dataValues.title, content: dataValues.content };
				});

				this.setState({ backgrounds });
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	render() {
		const { expand } = this.props;
		const { backgrounds } = this.state;

		let wordview = '';
		let levelSystem = '';
		let currencySystem = '';
		// filter worldview, level system, currency system out of arrays
		const leftBackgrounds: BackgroundDec[] = backgrounds.filter((background: BackgroundDec) => {
			if (background.title === '世界观') {
				wordview = background.content;
				return false;
			}
			if (background.title === '等级体系') {
				levelSystem = background.content;
				return false;
			}
			if (background.title === '货币体系') {
				currencySystem = background.content;
				return false;
			}
			return true;
		});

		return (
			<Col
				span={19}
				className={
					classnames('background-page', {
						'main-grow': !expand
					})
				}
			>
				<PageHeader
					title={''}
					onBack={() => { this.props.history.go(-1); }}
					className="main-header"
					extra={[
						<Button
							key="quit"
							type="danger"
							ghost
							onClick={() => { this.props.history.go(-1); }}
						>
							<Icon type="rollback" />取消编辑
						</Button>,
						<Button
							key="edit"
							type="danger"
							className="green-button"
							// onClick={this.onSaveAndQuit}
							ghost
						>
							<Icon type="edit" />保存并退出编辑
						</Button>
					]}
				/>
				<div className="background-content">
					<Row className="background-section">
						<h2 className="background-name">{name}</h2>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							世界观
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.worldview}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							<TextArea
								rows={6}
								placeholder="请注意，世界观是必填的！！！"
								value={wordview}
								onChange={this.onTextAreaChange}
								name="世界观"
							/>
						</Col>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							等级体系
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.levelSystem}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							<TextArea
								rows={6}
								placeholder="请注意，等级体系是必填的！！！"
								value={levelSystem}
								onChange={this.onTextAreaChange}
								name="等级体系"
							/>
						</Col>
					</Row>
					<Row className="background-section">
						<Col span={3} offset={2}>
							货币体系
							<Tooltip
								placement="rightTop"
								title={backgroundIllustrations.currencySystem}
							>
								<Icon type="question-circle" className="question-mark" />
							</Tooltip>
						</Col>
						<Col span={19}>
							<TextArea
								rows={6}
								placeholder="请注意，货币体系是必填的！！！"
								value={currencySystem}
								onChange={this.onTextAreaChange}
								name="货币体系"
							/>
						</Col>
					</Row>
					{
						leftBackgrounds.map((background: BackgroundDec) => (
							<Row className="background-section" key={background.title}>
								<Col span={3} offset={2}>{background.title}：</Col>
								<Col span={19}>
									{background.content}
								</Col>
							</Row>
						))
					}
				</div>
			</Col>
		);
	}
}

export default withRouter(BackgroundEdit);
