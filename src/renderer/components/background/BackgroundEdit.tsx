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
		ctrlsPress(e, () => this.onSave(true));
	}

	// when add new property
	onAddProperty = () => {
		this.setState((prevState: BackgroundState) => ({
			...prevState,
			backgrounds: prevState.backgrounds.concat({ id: -1, title: '', content: '', created: true })
		}));
	}

	// when delete property
	onDeleteProperty = (index: number) => {
		/**
		 * filter based on index (after exclude all pre-defined properties)
		 * 1) if current element is created element (which means it does not exist in database)
		 * 		just delete it from the state
		 * 2) if current element is not created element, need to mark it as deleted
		 */
		let curr = 0;
		const backgrounds: BackgroundDec[] = this.state.backgrounds.filter((background: BackgroundDec) => {
			if (background.title !== '世界观' &&
				background.title !== '等级体系' &&
				background.title !== '货币体系'
			) {
				/**
				 * check if curr === index
				 * if so, we find the index to update
				 */
				if (curr === index) {
					curr++;
					if (background.created) return false;
					background.deleted = true;
				}
				curr++;
			}
			return true;
		});

		this.setState({ backgrounds });
	}

	// when input field changes
	onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const title: string = e.target.value;

		/**
		 * iterate through all inputs and filter all pre-determined properties
		 * then check if current property is in the array by index
		 */
		let curr = 0;
		let contain = false;
		const backgrounds: BackgroundDec[] = this.state.backgrounds.map((background: BackgroundDec) => {
			if (background.title !== '世界观' &&
				background.title !== '等级体系' &&
				background.title !== '货币体系'
			) {
				/**
				 * check if curr === index
				 * if so, we find the index to update
				 */
				if (curr === index) {
					background.title = title;
					background.updated = true;
					contain = true;
				}
				curr++;
			}
			return background;
		});

		// if background contains current title, just update
		if (contain) {
			this.setState({ backgrounds });
		} else {
			// otherwise, only create new title
			this.setState((prevState: BackgroundState) => ({
				...prevState,
				backgrounds: prevState.backgrounds.concat({ title, content: '', id: -1, created: true })
			}));
		}
	}

	// when textarea changes
	onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number | null) => {
		const title: string = e.target.name;
		const content: string = e.target.value;

		/**
		 * iterate through all backgrounds
		 * 1) if current title exists, just update it
		 * 2) if current title exists but it empty, just update it
		 * 3) if current title does not exist, need to create it
		 */
		let curr = 0;
		let contain = false;
		const backgrounds: BackgroundDec[] = this.state.backgrounds.map((background: BackgroundDec) => {
			/**
			 * this should only happen to per-defined properties
			 * because only pre-defined properties have name
			 */
			if (background.title === title) {
				background.content = content;
				background.updated = true;
				contain = true;
				return background;
			}

			if (background.title !== '世界观' &&
				background.title !== '等级体系' &&
				background.title !== '货币体系'
			) {
				/**
				 * check if curr === index
				 * if so, we find the index to update
				 */
				if (curr === index) {
					background.content = content;
					background.updated = true;
					contain = true;
				}
				curr++;
			}
			return background;
		});

		// if background contains current content, just update
		if (contain) {
			this.setState({ backgrounds });
		} else {
			// otherwise, only create new content
			this.setState((prevState: BackgroundState) => ({
				...prevState,
				backgrounds: prevState.backgrounds.concat({ content, title: title ? title : '', id: -1, created: true })
			}));
		}

		return;
	}

	// save
	onSave = (shouldRerender: boolean) => {
		return createAndUpdateBackgrounds(this.state.novel_id, this.state.backgrounds)
			.then(() => {
				Message.success('更新成功！');
				if (shouldRerender) this.setBackground();
				Promise.resolve();
			})
			.catch((err: DatabaseError) => {
				Message.error(err.message);
			});
	}

	// save and quit
	onSaveAndQuit = () => {
		this.onSave(false)
			.then(() => {
				this.props.history;
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
					onBack={() => { this.props.history.goBack(); }}
					className="main-header"
					extra={[
						<Button
							key="quit"
							type="danger"
							ghost
							onClick={() => { this.props.history.goBack(); }}
						>
							<Icon type="rollback" />取消编辑
						</Button>,
						<Button
							key="edit"
							type="danger"
							className="green-button"
							onClick={this.onSaveAndQuit}
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
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onTextAreaChange(e, null)}
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
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onTextAreaChange(e, null)}
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
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onTextAreaChange(e, null)}
								name="货币体系"
							/>
						</Col>
					</Row>
					{
						leftBackgrounds.map((background: BackgroundDec, index: number) => {
							if (!background.deleted) {
								return (
									<Row className="background-section" key={index}>
										<Col span={3} offset={2}>
											<div className="delete-icon-container">
												<Icon
													type="delete"
													className="delete-icon"
													onClick={() => this.onDeleteProperty(index)}
												/>
											</div>
											<input
												value={background.title}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.onInputChange(e, index)}
												className="background-input"
											/>
										</Col>
										<Col span={19}>
											<TextArea
												rows={6}
												placeholder="自定义内容"
												value={background.content}
												onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onTextAreaChange(e, index)}
											/>
										</Col>
									</Row>
								);
							}
							return '';
						})
					}
					<Button
						type="primary"
						ghost
						className="green-button background-add-button"
						onClick={this.onAddProperty}
					>
						<Icon type="plus" />
					</Button>
				</div>
			</Col>
		);
	}
}

export default withRouter(BackgroundEdit);
