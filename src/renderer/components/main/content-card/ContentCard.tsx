import * as React from 'react';
import { Icon } from 'antd';

// type declaration
import { ContentCardProps, ContentCardState } from './contentCardDec';

// sass
import './content-card.scss';

class ContentCard extends React.Component<ContentCardProps, ContentCardState> {
	render() {
		const {
			color,
			character_id,
			timeline_id,
			contents,
			onTextareaResize,
			onContentChange,
			createTextAreaLocally,
			isLast,
			isFirst,
			showPlusIcons
		} = this.props;
		return (
			<td style={{ paddingTop: isFirst ? '50px' : '0' }}>
				<div
					className={isLast ? 'last-content-vertical-line' : 'content-vertical-line'}
					style={{ background: color }}
				/>
				{
					!showPlusIcons && (contents.get(character_id) || new Map()).get(timeline_id) &&
					(
						<div className="main-content-card" style={{ borderColor: color }}>
							<textarea
								wrap="hard"
								onFocus={onTextareaResize}
								onInput={onTextareaResize}
								onChange={
									(e: React.ChangeEvent<HTMLTextAreaElement>) => onContentChange(character_id, timeline_id, e)
								}
								value={(contents.get(character_id) || new Map()).get(timeline_id).content}
								autoFocus
							/>
						</div>
					)
				}
				{
					showPlusIcons && (
						<div className="main-content-card" style={{ borderColor: color }}>
							{
								(contents.get(character_id) || new Map()).get(timeline_id) ?
									(
										<textarea
											wrap="hard"
											onFocus={onTextareaResize}
											onInput={onTextareaResize}
											onChange={
												(e: React.ChangeEvent<HTMLTextAreaElement>) => onContentChange(character_id, timeline_id, e)
											}
											value={(contents.get(character_id) || new Map()).get(timeline_id).content}
											autoFocus
										/>
									) :
									(
										<Icon
											type="plus-circle"
											className="plus-icon"
											onClick={() => createTextAreaLocally(character_id, timeline_id)}
										/>
									)
							}
						</div>
					)
				}
			</td>
		);
	}
}

export default ContentCard;
