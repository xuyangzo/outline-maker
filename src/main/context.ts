import { BrowserWindow } from 'electron';

// check whether dev mode or production mode
const isDev = process.env.NODE_ENV !== 'production';

export default {
	prepend: (defaultActions: any, params: Electron.ContextMenuParams, browserWindow: BrowserWindow) => [
		{
			label: 'Rainbow',
			// Only show it when right-clicking images
			visible: params.mediaType === 'image'
		},
		{
			label: '添加到收藏',
			visible: params.selectionText.trim().length > 0,
			click: () => { console.log(params); }
		}
	],
	labels: {
		cut: '剪切',
		copy: '复制',
		paste: '粘贴',
		save: 'Custom Save Image Text',
		saveImageAs: 'Custom Save Image As… Text',
		copyLink: 'Custom Copy Link Text',
		copyImageAddress: 'Custom Copy Image Address Text',
		inspect: 'inspect！！！'
	},
	// TODO should disable this in production mode
	showInspectElement: isDev
};
